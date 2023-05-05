///Macro that adds a token to the combat tracker and sets an initiative value based on the Token's name
const combat = game.combat ?? await Combat.create({scene: canvas.scene.id, active: true});
	for(const token of canvas.tokens.controlled){
    let orc = token.name
    let initVal
        if (orc === "Scyza")                {initVal = 20;}
        else if (orc === "Dohma Raskovar")  {initVal = 18;}
        else if (orc === "Wizard")          {initVal = 17;}
        else if (orc === "Orc Garroter")    {initVal = 16;}
        else if (orc === "Orc Godcaller")   {initVal = 14;}
        else if (orc === "Barbarian")       {initVal = 13;} 
        else if (orc === "Orc Bloodrunner") {initVal = 12;} 
        else if (orc === "Orc Fury")        {initVal = 10;} 
        else if (orc === "Cleric")          {initVal = 9;} 
        else if (orc === "Orc Conduit")     {initVal = 8;} 
        else if (orc === "Orc Rampart")     {initVal = 6;}
        else if (orc === "Paladin")         {initVal = 5;} 
        else if (orc === "Orc Blitzer")     {initVal = 4;} 
        else if (orc === "Orc Terranova")   {initVal = 2.1;}
        else if (orc === "Mohler")          {initVal = 2;} 
        else {initVal = 0;}
	if(!token.combatant) await token.toggleCombat();
	await token.combatant.update({initiative: initVal});
}
