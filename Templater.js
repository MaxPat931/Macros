//Creates a template with specified parameters when executed from chat
//Example: "/m Templater distance=20 type=circle" - 20ft circle, ie Fireball
//Example: "/m Templater distance=15 type=cone" - 15ft Cone, ie Dragon's Breath
//Example: "/m Templater distance=40 width=10" - 40ft long 10ft wide Ray, ie Gust of Wind

const data = {
    t: scope.type || "ray",
    x: scope.x || 0,
    y: scope.y || 0,
    distance: scope.distance || 0,
    direction: scope.direction || 0,
    angle: scope.angle || 53.2,
    width: scope.width || 5,
    borderColor: scope.borderColor || "#000000",
    fillColor: scope.fillColor || game.user.color,
    "hidden": scope.hidden || "false",
    "flags": {}
};

const temp = new MeasuredTemplateDocument(data, { parent: canvas.scene });

if (scope.x && scope.y) {
    await MeasuredTemplateDocument.create(temp, { parent: canvas.scene });
} else {
    const windows = Object.values(ui.windows);
    const maximizedWindows = windows.filter(w => !w._minimized);
    const minimizedWindows = windows.filter(w => w._minimized);
    maximizedWindows.forEach(w => w.minimize(true));

    new game.dnd5e.canvas.AbilityTemplate(temp).drawPreview()
        .then(() => {
            maximizedWindows.forEach(w => w.maximize(true));
        })
}
