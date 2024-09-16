/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { BirthdayService } from 'src/service/birthday.service';
import { NoteService } from 'src/service/note.service';
import { Context, Telegraf } from 'telegraf';
import { ListService } from 'src/service/list.service';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ReminderService } from 'src/service/reminder.service';
import { UserCredentialService } from 'src/service/usercredential.service';
import * as fs from 'fs';
import { Cron } from '@nestjs/schedule';

@Update()
@Injectable()
export class BotService {
  private bot: Telegraf;

  private pinRequest: Set<number> = new Set();

  constructor(
    private readonly noteService: NoteService,
    private readonly birthdayService: BirthdayService,
    private readonly listService: ListService,
    private readonly reminderService: ReminderService,
    private readonly userCrendentialService: UserCredentialService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    try {
      await ctx.telegram.setMyCommands([
        {
          command: 'start',
          description: 'Open your command list',
        },
        {
          command: 'addnote',
          description: 'Add notes',
        },
        {
          command: 'getlabel',
          description: 'Get notes by label',
        },
        {
          command: 'exnotestxt',
          description: 'Export your notes to .txt file',
        },
        {
          command: 'exnotescsv',
          description: 'Export your notes to .csv file',
        },
        {
          command: 'addbday',
          description: 'Add birthday',
        },
        {
          command: 'exbdaystxt',
          description: 'Export your birthdays list to .txt file',
        },
        {
          command: 'exbdayscsv',
          description: 'Export your birthdays list to .csv file',
        },
        {
          command: 'createlist',
          description: 'Create list and add items to list',
        },
        {
          command: 'removeitem',
          description: 'Remove item',
        },
        {
          command: 'updateitem',
          description: 'Update item',
        },
        {
          command: 'getlist',
          description: 'Show lists',
        },
        {
          command: 'exliststxt',
          description: 'Export your lists to .txt file',
        },
        {
          command: 'exlistscsv',
          description: 'Export your lists to .csv file',
        },
        {
          command: 'setreminder',
          description: 'Set reminder',
        },
        {
          command: 'exreminderstxt',
          description: 'Export your reminders list to .txt file',
        },
        {
          command: 'exreminderscsv',
          description: 'Export your reminders list to .csv file',
        },
        {
          command: 'setpin',
          description: 'Set PIN',
        },
        {
          command: 'enterpin',
          description: 'Enter your PIN to access data',
        },
        {
          command: 'changepin',
          description: 'Change PIN',
        },
      ]);
      await ctx.reply('Button menu has been recreated!');
    } catch (error) {
      console.error('Error setting command:', error);
      await ctx.reply('An error occurred while setting up the menu button.');
    }

    await ctx.reply(
      `Commands you can use:
    Note:
    - Add notes: /addnote <label> <content>
    - Get notes by label: /getlabel <label>
    - Export your notes to .txt file: /exnotestxt
    - Export your notes to .csv file: /exnotescsv

    Birthday:
    - Add birthday: /addbday <name> <birthday date(MM-DD-YYYY)> 
    - Birthdays will be reminded 1 day in advance     
    - Export your birthdays list to .txt file: /exbdaystxt
    - Export your birthdays list to .csv file: /exbdayscsv

    List
    - Create list and add items to list: /createlist <list name> <item name>
    - Remove item: /removeitem <item>
    - Update item: /updateitem <item> <true|false>
    - Show lists: /getlist <listName>
    - Export your lists to .txt file: /exliststxt
    - Export your lists to .csv file: /exlistscsv

    Reminder
    - Set reminder: /setreminder MM:DD HH:MM "message".
    - Export your reminders list to .txt file: /exreminderstxt
    - Export your reminders list to .csv file: /exreminderscsv

    User credential:
    - Set PIN: /setpin <Your PIN>
    - Enter your PIN to access data: /enterpin <Your PIN>
    - Change PIN: /changepin <old PIN> <new PIN>
      `,
    );
  }

  @Hears('removemenu')
  async removeMenu(@Ctx() ctx: Context) {
    try {
      await ctx.telegram.setMyCommands([]);
      await ctx.reply('Button menu has been removed!');
    } catch (error) {
      console.error('Error when deleting menu button:', error);
      await ctx.reply('Có lỗi xảy ra khi xóa button menu.');
    }
  }

  // @Hears('createmenu')
  // async createMenu(@Ctx() ctx: Context) {

  // }

  @Hears('/help')
  async helpCommand(@Ctx() ctx: Context) {
    const helpMessage = `
    Commands you can use:
    Note:
    - Add notes: /addnote <label> <content>
    - Get notes by label: /getlabel <label>
    - Export your notes to .txt file: /exnotestxt
    - Export your notes to .csv file: /exnotescsv

    Birthday:
    - Add birthday: /addbday <name> <birthday date(MM-DD-YYYY)> 
    - Birthdays will be reminded 1 day in advance     
    - Export your birthdays list to .txt file: /exbdaystxt
    - Export your birthdays list to .csv file: /exbdayscsv

    List
    - Create list and add items to list: /createlist <list name> <item name>
    - Remove item: /removeitem <item>
    - Update item: /updateitem <item> <true|false>
    - Show lists: /getlist <listName>
    - Export your lists to .txt file: /exliststxt
    - Export your lists to .csv file: /exlistscsv

    Reminder
    - Set reminder: /setreminder MM:DD HH:MM "message".
    - Export your reminders list to .txt file: /exreminderstxt
    - Export your reminders list to .csv file: /exreminderscsv

    User credential:
    - Set PIN: /setpin <Your PIN>
    - Enter your PIN to access data: /enterpin <Your PIN>
    - Change PIN: /changepin <old PIN> <new PIN>
    `;
    await ctx.reply(helpMessage);
  }

  //Note
  @Hears(/^\/addnote (.+) (.+)/)
  async addNoteCommand(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const message = ctx.message.text;
      const [, label, content] = message.match(/^\/addnote (.+) (.+)/);

      await this.noteService.createNote(label, content);
      await ctx.reply(`Saved note with label "${label}".`);
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/^\/getlabel (.+)/)
  async getNotesCommand(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const message = ctx.message.text;
      const match = message.match(/^\/getlabel (.+)/);
      if (!match) {
        await ctx.reply('Invalid command format. Use /get [label]');
        return;
      }

      const [, label] = match;
      const notes = await this.noteService.findNotesByLabel(label);
      if (notes.length === 0) {
        await ctx.reply(`No notes found with label "${label}".`);
      } else {
        const response = notes.map((note) => `- ${note.content}`).join('\n');
        await ctx.reply(`Notes with label "${label}":\n${response}`);
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears('/getalllabels')
  async getLabelsCommand(@Ctx() ctx: Context) {
    const notes = await this.noteService.getAllLabels();

    if (notes.length === 0) {
      await ctx.reply(`You don't have any notes yet.`);
    } else {
      const response = notes
        .map((note) => `${note.label}- ${note.content}`)
        .join('\n');
      await ctx.reply(`Your labels: \n${response}`);
    }
  }

  @Hears(/\/exnotestxt/)
  async exportNotesTxtCommand(@Ctx() ctx: Context) {
    const filePath = await this.noteService.exportNotesToTxt();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'notes.txt',
    });
  }

  @Hears(/\/exnotescsv/)
  async exportNotesCsvCommand(@Ctx() ctx: Context) {
    const filePath = await this.noteService.exportNotesToCsv();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'notes.csv',
    });
  }

  //Birthday
  @Hears(/^\/addbday (.+) (\d{2}-\d{2}-\d{4})$/)
  async addBirthdayCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id;

    if ('text' in ctx.message) {
      const message = ctx.message.text;
      const [, name, dateStr] = message.match(
        /^\/addbday (.+) (\d{2}-\d{2}-\d{4})$/,
      );
      const [day, month, year] = dateStr.split('-');
      const date = new Date(`${day}-${month}-${year}`);

      await this.birthdayService.addBirthday(userId, name, date);
      await ctx.reply(
        `Saved ${name}'s birthday to ${date}. You will receive a reminder the day before your birthday!`,
      );
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Cron('35 11 * * *')
  async handleCron() {
    await this.sendBirthdayReminders();
  }

  async sendBirthdayReminders() {
    const birthdays = await this.birthdayService.getUpcomingBirthdays();
    birthdays.forEach(async (birthday) => {
      await this.bot.telegram.sendMessage(
        birthday.userId,
        `Reminder: Tomorrow is ${birthday.name}'s birthday!`,
      );
    });
  }

  @Hears(/\/exbdaystxt/)
  async exportBirthdaysTxtCommand(@Ctx() ctx: Context) {
    const filePath = await this.birthdayService.exportBirthdaysToTxt();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'birthdays.txt',
    });
  }

  @Hears(/\/exbdayscsv/)
  async exportBirthdaysCsvCommand(@Ctx() ctx: Context) {
    const filePath = await this.birthdayService.exportBirthdaysToCsv();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'birthdays.csv',
    });
  }

  //List
  @Hears(/^\/createlist (.+) (.+)$/)
  async addItem(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = (ctx.message as Message.TextMessage).text;

      const regex = /^\/createlist (.+) (.+)$/;
      const match = messageText.match(regex);

      if (match) {
        const listName = match[1];
        const itemName = match[2];

        await this.listService.createList(listName, itemName);
        await ctx.reply(
          `The list "${listName}" has been created with the item "${itemName}".`,
        );
      } else {
        await ctx.reply(
          'Please enter the correct format: /createList <list name> <item>',
        );
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/^\/removeitem (.+)$/)
  async removeItem(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const message = ctx.message.text;
      const item = message.split(' ')[1];

      await this.listService.removeItem(item);
      await ctx.reply(`Item "${item}" has been removed.`);
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/^\/updateitem (.+) (true|false)$/)
  async updateItem(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = (ctx.message as Message.TextMessage).text;

      const regex = /^\/updateitem (.+) (true|false)$/;
      const match = messageText.match(regex);
      if (match) {
        console.log(`Received message: ${ctx.message.text}`);
        const items = match[1];
        const is_done = match[2] === 'true';
        console.log(`Extracted item: ${items}, is_done: ${is_done}`);
        const updatedItem = await this.listService.updateItem(items, is_done);
        if (updatedItem) {
          await ctx.reply(
            `Updated: ${updatedItem.items} - Completed: ${updatedItem.is_done}`,
          );
        } else {
          await ctx.reply('Item not found.');
        }
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/^\/getlist (.+)$/)
  async getAllLists(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = (ctx.message as Message.TextMessage).text;

      const regex = /^\/getlist (.+)$/;
      const match = messageText.match(regex);

      if (match) {
        const listName = match[1];
        const items = await this.listService.getLists(listName);

        if (items.length > 0) {
          const listMessage = items
            .map(
              (item) =>
                `${item.id}. ${item.items} - ${item.is_done ? 'Completed' : 'Not completed'}`,
            )
            .join('\n');
          await ctx.reply(`${listName} list:\n${listMessage}`);
        } else {
          await ctx.reply(`There are no items in the list "${listName}".`);
        }
      } else {
        await ctx.reply('Please enter the correct format: /list <list_name>');
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/\/exliststxt/)
  async exportListsTxtCommand(@Ctx() ctx: Context) {
    const filePath = await this.listService.exportListsToTxt();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'lists.txt',
    });
  }

  @Hears(/\/exlistscsv/)
  async exportListsCsvCommand(@Ctx() ctx: Context) {
    const filePath = await this.listService.exportListsToCsv();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'lists.csv',
    });
  }

  //reminder
  @Hears(/^\/setreminder (\d{2}):(\d{2}) (\d{2}):(\d{2}) "(.+)"$/)
  async setReminder(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const match =
        /^\/setreminder (\d{2}):(\d{2}) (\d{2}):(\d{2}) "(.+)"$/.exec(
          ctx.message.text,
        );

      if (match) {
        const [, month, day, hour, minute, message] = match;
        const now = new Date();
        const reminderTime = new Date(
          now.getFullYear(),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
        );

        if (isNaN(reminderTime.getTime())) {
          await ctx.reply(
            'Reminder time is unreasonable. Please enter the correct time format (MM-DD HH:MM).',
          );
          return;
        }

        if (reminderTime <= now) {
          await ctx.reply('Reminder time has passed!');
          return;
        }
        const chatId = ctx.chat.id;

        await this.reminderService.createReminder(
          chatId,
          message,
          reminderTime,
        );
        await ctx.reply(
          `Reminder has been set for "${message}" on ${reminderTime}`,
        );

        this.scheduleSingleReminder(chatId, message, reminderTime, ctx);
      } else {
        await ctx.reply(
          'Please enter the correct format: /setReminder MM:DD HH:MM "message"',
        );
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  private scheduleSingleReminder(
    chatId: number,
    message: string,
    reminderTime: Date,
    ctx: Context,
  ) {
    const delay = reminderTime.getTime() - new Date().getTime();

    setTimeout(async () => {
      await this.reminderService.sendReminder(chatId, message, ctx);
      this.reminderService.removeReminder(chatId, message, reminderTime);
    }, delay);
  }

  @Hears(/\/exreminderstxt/)
  async exportRemindersTxtCommand(@Ctx() ctx: Context) {
    const filePath = await this.reminderService.exportRemindersToTxt();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'reminders.txt',
    });
  }

  @Hears(/\/exreminderscsv/)
  async exportRemindersCsvCommand(@Ctx() ctx: Context) {
    const filePath = await this.reminderService.exportRemindersToCsv();
    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: 'reminders.csv',
    });
  }

  //set pin
  @Hears(/\/setpin (\d{4,6})/)
  async setPin(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = (ctx.message as Message.TextMessage).text;

      const regex = /\/setpin (\d{4,6})/;
      const match = messageText.match(regex);
      if (match && match[1]) {
        const pin = match[1];
        await this.userCrendentialService.setPin(pin);
        await ctx.reply(`Your PIN has been set`);
      } else {
        await ctx.reply('Please enter the correct format: /setPin XXXX');
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/\/enterpin (\d{4,6})/)
  async accessData(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = ctx.message.text;

      const regex = /\/enterpin (\d{4,6})/;
      const match = messageText.match(regex);
      if (match && match[1]) {
        const pin = match[1];

        const isValid = await this.userCrendentialService.verifyPin(pin);
        if (isValid) {
          await ctx.reply('Welcome! You can see your data here.');
          const lists = await this.listService.getAllLists();
          if (lists.length > 0) {
            const yourLists = lists
              .map(
                (list) =>
                  `List name: ${list.list_name} - Item: ${list.items} - Is done? ${list.is_done ? 'Completed' : 'Not completed'}`,
              )
              .join('\n');
            await ctx.reply(`Your lists:\n${yourLists}`);
          } else {
            await ctx.reply('No list found.');
          }
          const notes = await this.noteService.getAllLabels();
          if (notes.length > 0) {
            const yourNotes = notes
              .map((note) => `Label: ${note.label} - Content: ${note.content}`)
              .join('\n');
            await ctx.reply(`Your notes:\n${yourNotes}`);
          } else {
            await ctx.reply('No note with found.');
          }
          const birthdays = await this.birthdayService.getAllBirthdays();
          if (birthdays.length > 0) {
            const yourBirthdays = birthdays
              .map(
                (birthday) =>
                  `Name: ${birthday.name} - Date of birth: ${birthday.date}`,
              )
              .join('\n');
            await ctx.reply(`Your birthdays list:\n${yourBirthdays}`);
          } else {
            await ctx.reply('No birthday found.');
          }
        } else {
          await ctx.reply('Invalid PIN.');
        }
        const reminders = await this.reminderService.getAllReminders();
        if (reminders.length > 0) {
          const yourReminders = reminders
            .map(
              (reminder) =>
                `Message: ${reminder.message} - Time: ${reminder.reminderTime}`,
            )
            .join('\n');
          await ctx.reply(`Your reminders:\n${yourReminders}`);
        } else {
          await ctx.reply('No list found.');
        }
      } else {
        await ctx.reply('Please provide a valid PIN.');
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @Hears(/\/changepin (\d{4,6}) (\d{4,6})/)
  async changePin(@Ctx() ctx: Context) {
    if ('text' in ctx.message) {
      const messageText = (ctx.message as Message.TextMessage).text;

      const regex = /\/changepin (\d{4,6}) (\d{4,6})/;
      const match = messageText.match(regex);
      if (match) {
        const oldPin = match[1];
        const newPin = match[2];

        const isChanged = await this.userCrendentialService.changePin(
          oldPin,
          newPin,
        );
        if (isChanged) {
          await ctx.reply('Your PIN has been successfully changed.');
        } else {
          await ctx.reply('Invalid old PIN. Please try again.');
        }
      }
    } else {
      await ctx.reply('Sorry, I only understand text messages.');
    }
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    await ctx.reply(
      `Sorry, I don't understand your request. Use /help to view instructions.`,
    );
  }
}
