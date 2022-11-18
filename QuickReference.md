# ATL Quick Reference

```
ATL.
    alpha                           | 0.0:1.0
    elevation                       | #
    height                          | #
    width                           | #
    hidden                          | true/false
    rotation                        | 0:360
    detectionModes.
          basic.
          seeInvisibility.
          senseInvisibility.
          feelTremor.
          seeAll.
          senseAll.
                   range            | #
    light.
          alpha                     | 0.00:1.00
          angle                     | 0:360
          animation                 | {intensity: 1:10, reverse: true/false, speed: 1:10, type: "X"}
          attenuation               | 0.00:1.00
          bright                    | #
          color                     | #XXXXXX
          coloration                | 0:10 (see below)
          contrast                  | -1.00:1.00
          dim                       | #
          luminosity                | -1.00:1.00
          saturation                | -1.00:1.00
          shadows                   | 0.00:1.00
          darkness.
                   max              | 0:1 (Default 1)
                   min              | 0:1 (Default 0)
    sight.
          angle                     | 0:360
          attenuation               | 0.00:1.00
          brightness                | -1.00:1.00
          color                     | #XXXXXX
          contrast                  | -1.00:1.00
          enabled                   | true/false
          range                     | #
          saturation                | -1.00:1.00
          visionMode                | X (see below)
    texture.
          offsetX                   | #?
          offsetY                   | #?
          rotation                  | 0:360
          scaleX                    | 0.2:3.0
          scaleY                    | 0.2:3.0
          src                       | img/path.webp
          tint                      | #XXXXXX
```


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

`ATL.detectionModes` - NEW

`ATL.elevation` - Upgrade/Downgrade/Override value does not revert when effect removed

`ATL.hidden` - Does not "unhide" token when effect removed

`ATL.light.darkness.min/max` - Darkness Activation Ranges for Token light, but the scene must be dark enough for the light to be ON when effect is added for it to work

`ATL.texture.offsetX/Y` - Not currently functional


