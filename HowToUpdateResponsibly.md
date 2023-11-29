This guide focuses on using [Foundry's built in back up features](https://foundryvtt.com/article/backups/), if you are using a Hosting Partners such as Forge, Foundry Server, or Molten, they may have their own backup processes which differ from those detailed here, you will need to refer to the Hosting Partner for their best practices.

# A New Update Appears!
So, you logged in to your game and you see that bright orange ❗ Update notification, a new update for the DnD5e system is available!  
<p align="center"> 
<img src="https://github.com/MaxPat931/Macros/assets/86370342/219f9847-c748-4b8d-9d88-9fe2c7b0b8da">
</p>
You run immediately to the Setup Screen to update the system for all the latest goodies, BUT WAIT! System updates (particularly major version releases, like 2.X) may come with changes that your modules may be incompatible with.  

<h2 align="center"> BEFORE UPDATING THE SYSTEM IT IS TIME TO TAKE A BACKUP! </h2>

# Take a Snapshot
Taking a snapshot is the most comprehensive way to take a back up. A snapshot will save the state of all of your Worlds, Systems, and Modules. This means that you can revert back to the exact state your Foundry environment is currently in, regardless of any updates or changes you make.  
<p align="center"> 
<img src="https://github.com/MaxPat931/Macros/assets/86370342/4b65dd5d-e9de-413f-b30c-e02fc9be9f4f">
</p>

Due the the thurough nature of this backup method, a snap shot can take up a considerable amount of storage space, when you are creating a snapshot, Foundry will display the size needed for your snapshot and how much space is available.  
<p align="center"> 
<img src="https://github.com/MaxPat931/Macros/assets/86370342/6fea6e98-7eaa-401e-a523-f17bfbe2bfd3">
</p>

A snapshot does NOT backup any personal file you have stored in your /data folder that is outside of the Worlds, Systems, or Module folders.

## Taking a Snapshot
To take a snapshot, click on the Manage Backups 💾 Floppy disk icon.  
The Manage Backups window will open, at the top, click on "Create a Snapshot"  
In the Create a Snapshot window, you have an option to add a note for your reference to display in the Backup Manager.  
Click YES to start your snapshot.  
Once complete, you will be able to see the new Snapshot, as well as individual backups for each of your Worlds, Modules, and Systems.  


https://github.com/MaxPat931/Macros/assets/86370342/f5afdd27-a9c7-4642-9be9-5fb992ec8fd3

## Optional: Back up a World, System, or Module individually
You can back up a World, System, or Module individually by right-clicking on the package, then clicking Take Backup.  
<p align="center"> 
<img src="https://github.com/MaxPat931/Macros/assets/86370342/e6f65d15-7daa-45c8-aa05-7cfecf6cd443">
</p>

## Mash that Update Button
Go on, you know you want to.

## Launch World and test
Now that we have backed up and updated, it is time to launch our world and see how everything looks.  
When you first launch your world, Foundry will recognize that your new system version is higher that the last time this world was launched, and prompt you to take a World backup, since we already have our snapshot, this is not necessary, but it doesnt hurt to be extra careful and to get in the habit of taking backups.   
![image](https://github.com/MaxPat931/Macros/assets/86370342/e9c0e425-7d20-4626-83b7-7c5435b90380)
![image](https://github.com/MaxPat931/Macros/assets/86370342/be6fdcaf-dde2-471c-b1ca-f5157fe4168a)  

https://github.com/MaxPat931/Macros/assets/86370342/3f2365f9-fc2e-41ce-b6c3-3b7d72402768


Once you sign in and launch your game, the system may start a migration, you will see a blue banner at the top of your screen as the migration processes.  
Press F12 on your keyboard to open up the browser's Console, and you will be able to see the records being migrated. You may also see Yellow Warning messages, or Red Error messages.  
Once the migration has completed, start playing around and testing your world, keep the console open for any Warnings or Errors that may come up.  

<p align="center"> 
<img src="https://github.com/MaxPat931/Macros/assets/86370342/bb402c3a-6a1a-47bc-9b66-a9cef931f461">
</p>

Yellow Warning messages will not prevent you from playing your game, and are mostly warning for developers that a feature they are using is set for deprication in the future and needs to be updated. Generally you do not need to do anything for warnings.  
Red Error messages are more serious, and may prevent you from playing your game. If there are errors that prevent you from playing your game, you will need to triage the error to find out what is going on.  

## Troubleshooting Errors
**Step 1: Read the Error Message.**  
Sometimes the error message will indicate where the issue is coming from and you can determine how to fix it yourself.  

**Step 2: Turn off ALL Modules**.  
Yup. Gotta determine if the issue is being caused by the new system update, or installed modules.  
If the errors persist, it's an issue with the System update, if the errors are gone, it's caused by a module.  
If the error is caused by the system, first hop into the Discord and confirm is others are having the same issue, we can collectively troubleshoot to find a solution, or determine if an Issue on the GitHub is necessary. 

**Step 3: Triage Modules.**  
To determine which module is causing the issue, you can systematically enable and disable groups of modules until you find the offender, the module Find the Culprit can halp facilitate this.

## Restoring from a Backup
If errors prevent you from playing, then you'll want to return to the Setup and restore from a backup or snapshot.  
To restore a specific World, System, or Module, right-click on the package, and select either Restore Latest Backup or Manage Backups.    

https://github.com/MaxPat931/Macros/assets/86370342/2fec0a3f-07c4-4ef2-b8a2-f2e3c1f7bed6

To restore from a snapshot, which will revert ALL Worlds, Systems, and Modules to the state at which the snapshot was made, on the Setup screen click on the Manage Backups 💾 Floppy disk icon, select the Snapshot category, then click Restore.  
Type in the randomly generated code to confirm your intention, then click Yes.

https://github.com/MaxPat931/Macros/assets/86370342/8c10f073-40c9-4ff3-bac9-3227ab4ead1e


