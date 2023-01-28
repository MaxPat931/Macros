# ATL Quick Reference

| Token Attributes| Value | Description |
| ---- | ---- | ---- |
| ATL.alpha | 0.0:1.0| Token transparency |
| ATL.elevation | # | Token elevation |
| ATL.height | # | Token height, in grid squares, minimun .5 |
| ATL.width | # | Token width, in grid squares, minimun .5 |
| ATL.hidden | true/false | Hidden, removing this effect will not revert the hidden state of the token |
| ATL.rotation | 0:360 | Token rotation |

|Detection Modes| Value | Description |
| ---- | ---- | ---- |
| ATL.detectionModes.basic.range | # | Detection Modes|
| ATL.detectionModes.seeInvisibility.range | # | Detection Modes|
| ATL.detectionModes.senseInvisibility.range | # | Detection Modes|
| ATL.detectionModes.feelTremor.range | # | Detection Modes|
| ATL.detectionModes.seeAll.range | # | Detection Modes|
| ATL.detectionModes.senseAll.range | # | Detection Modes|

|Token Light| Value | Description |
| ---- | ---- | ---- |
| ATL.light.alpha | 0.00:1.00 | Light |
| ATL.light.angle | 0:360 | Light |
| ATL.light.animation | {intensity: 1:10, reverse: true/false, speed: 1:10, type: "X"} | Light Animation settings, see below for Animation Types |
| ATL.light.attenuation | 0.00:1.00 | Light |
| ATL.light.bright | # | Bright Light distance |
| ATL.light.color | #XXXXXX | Light |
| ATL.light.coloration | 0:10 | Light Coloration mode, see below for different options |
| ATL.light.contrast | -1.00:1.00 | Light |
| ATL.light.dim | # | Dim Light distance |
| ATL.light.luminosity | -1.00:1.00 | Light |
| ATL.light.saturation | -1.00:1.00 | Light |
| ATL.light.shadows | 0.00:1.00 | Light |
| ATL.light.darkness.max | 0:1 (Default 1)| Token Light Activation threshold, Scene Darkness level the light should turn off |
| ATL.light.darkness.min | 0:1 (Default 0) | Token Light Activation threshold, Scene Darkness level the light should turn on |

|Token Sight| Value | Description |
| ---- | ---- | ---- |
| ATL.sight.angle | 0:360 | Sight |
| ATL.sight.attenuation | 0.00:1.00 | Sight |
| ATL.sight.brightness | -1.00:1.00 | Sight |
| ATL.sight.color | #XXXXXX | Sight |
| ATL.sight.contrast | -1.00:1.00 | Sight |
| ATL.sight.enabled | true/false | Sight |
| ATL.sight.range | # | Sight |
| ATL.sight.saturation | -1.00:1.00 | Sight |
| ATL.sight.visionMode | see below | Sight |

|Token Texture | Value | Description |
| ---- | ---- | ---- |
| ATL.texture.rotation | 0:360 | Texture |
| ATL.texture.scaleX | 0.2:3.0 | Texture |
| ATL.texture.scaleY | 0.2:3.0 | Texture |
| ATL.texture.src | img/path.webp | Texture |
| ATL.texture.tint | #XXXXXX | Texture |


## ATL.light.animation {type: }
```
"flame"
"torch"
"pulse"
"chroma"
"wave"
"fog"
"sunburst"
"dome"
"emanation"
"hexa"
"ghost"
"energy"
"roiling"
"hole"
"vortex"
"witchwave"
"rainbowswirl"
"radialrainbow"
"fairy"
"grid"
"starlight"
"smokepatch"
```
## ATL.light.coloration codes
```
0 - Legacy Coloration
1 - Adaptive Luminance
2 - Internal Halo
3 - External Halo
4 - Color Burn
5 - Internal Color Burn
6 - External Color Burn
7 - Low Absorption
8 - High Absorption
9 - Invert Absorption
10 - Natural Light
```
## ATL.sight.visionMode 
```
basic
darkvision
monochromatic
tremorsense
lightAmplification
```
## Testing Notes

`ATL.elevation` - Upgrade/Downgrade/Override value does not revert when effect removed

`ATL.hidden` - Does not "unhide" token when effect removed

`ATL.light.darkness.min/max` - Darkness Activation Ranges for Token light, but the scene must be dark enough for the light to be ON when effect is added for it to work


