JS_Sphere_Lighting_Assignment

Student Number: P2912429
Studnet Name: Khyan Ali

A CPU based ray tracer built in JavaScript HTML and CSS. 

Tested in:
    Opera GX ( Latest ver. as of 20/03/26 )
    Google Chrome ( Latest ver. as of 20/03/26 )

It performs:
    - Ambient Lighting
    - Albedo Colouring
    - Diffuse Shading
    - Specular Lighting
    - Hard Shading
    - MultiSample Anti-Alisaing 

    - Coloured Lighting 
    - Bounce Reflection Lighting
    - Simple Fresnel Lighting (Illumination)

    - Customisablity for Spheres
    - Customisablity for Scene


To Run:

Run the: "Index.html" in a "live-server" extension using vscode; or Host the "Index.html" file locally and open the webpage in a modern internet browser.

*Notice: When initailly loading the web-page it may be uresponsive, as the ray-tracer starts immediately, this is normal behaviour


Select the scene either: 
    "Phong Demo" for the basic Red, Green and Blue sphere test (as required); 
    "Reflection Demo" an advanced scene for testing the bounce reflecion with other sphere objects.

Select any of the settings on the left-most panel, to change the scene's settings.

Select any of the settings in the right-most panel, to modify the spheres attributes.

Press the "Reload Scene" to recreate the scene and re-run the ray-tracer. ( This process may take some time ).



Basic TroubleShooting:

    - The page is uresponsive: Means the ray-tracer is still loading.

    - The screen shows black: The ray-tracer is still loading. ( If no error is shown in the console)

    - The screen turns black after moving the window/tab: Reload the scene.

    - The screen shows green ( when no colour settings changed ): Means the MSAA is too low or set to 0, turn the value slightly higher.

    - The spheres show bright white, and the screen is blown out: Means the "Fresnel Power" or "Specular Intensity" slider is too low, increase the lowest one.

    - The reflective sphere are black, with shading: Means the "Max Reflection Bounces" are too low, increase it.

    - The spheres are very dark: Means the "Ambient Light" is to low, increase it.

    - The sphere have disspeared after moving them: Means they probably went off-screen, refresh to reset the scene, or try and revert the movement.
