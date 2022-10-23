const item = token.actor.items.getName("Minute Meteors");
const total = item.system.uses.value - 1;
if (total === 0) await item.delete();
await item.update({"system.uses.value": total});
ui.notifications.notify(`2nd Meteor consumed`);
