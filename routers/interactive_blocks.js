module.exports = {
  schedule_vacay: message => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message
        },
        accessory: {
          type: "image",
          image_url:
            "https://api.slack.com/img/blocks/bkb_template_images/palmtree.png",
          alt_text: "plants"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "datepicker",
            action_id: "start_date",
            // "initial_date": "2109-06-07",
            placeholder: {
              type: "plain_text",
              text: "Select start date",
              emoji: true
            }
          },
          {
            type: "datepicker",
            action_id: "end_date",
            // "initial_date": "2019-06-07",
            placeholder: {
              type: "plain_text",
              text: "Select end date",
              emoji: true
            }
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit",
              emoji: true
            },
            style: "primary",
            value: "Custom Message"
            // confirm: {
            //   title: {
            //     type: "plain_text",
            //     text: "Are you sure?"
            //   },
            //   text: {
            //     type: "mrkdwn",
            //     // Trying to output the user selected date
            //     // "text": `Start: ${newDate[message.actions[0].block_id].start_date !== undefined ? newDate[message.actions[0].block_id].start_date : "bleh"} to End: ${newDate[message.actions[0].block_id].end_date !== undefined ? newDate[message.actions[0].block_id].end_date : "bleh"}`,
            //     text: "Please double check the date."
            //   },
            //   confirm: {
            //     type: "plain_text",
            //     text: "Confirm"
            //   },
            //   deny: {
            //     type: "plain_text",
            //     text: "Cancel"
            //   }
            // }
          }
        ]
      }
    ];
  },

  custom_message: () => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*Your Vacation has been scheduled!*\n Do you want to add a custom away message?"
        }
      },

      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Create Custom Message"
            },
            style: "primary",
            value: "Custom Message"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "No Thanks"
            },

            value: "Use Default Message"
          }
        ]
      }
    ];
  }
};
