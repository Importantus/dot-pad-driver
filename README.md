# ControllerControl

This is the software repository for the Controller project. The Controller project is a project that aims to create a controller that can be used to control a computer specifically for the purpose of web browsing. The controller is designed to be used by people with disabilities.

## Development

### Setup

> We assume that you have nodejs and npm installed on your machine.
> If you don't have nodejs and npm installed, you can download it from [here](https://nodejs.org/en/download/).

1. Clone the repository

```bash
git clone 
```

2. Install the dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

### Debugging

The project contains an .env file with options for debugging. The options are as follows:

- `DEBUG_KEYBOARD_INPUT_MODE`: Set to `true` to enable input via a keyboard for testing.<br>
**Default:** `false`

- `DEBUG_KEYBOARD_INPUT_MODE`: Set to `true` to automatically lock all keys for the application on startup (See Keyboard Input Mode below).<br>
**Default:** `true`

- `DEBUG_OPEN_DEVTOOLS_ON_STARTUP`: Set to `true` open the Chrome DevTools on startup.<br>
**Default:** `false`

#### Keyboard Input Mode

***Warning***
Keyboard input mode emulates the use of a dot-pad controller. To allow for inputs while the app is not in focus it will lock all keys listed below on your keyboard. To toggle the lock of the keys press `Numpad *`.

While in keyboard input mode, you can use the following keys to simulate the controller input:

- `Numpad 1`: Press the left side rectangle button. (Orange Tab Toggle)
- `Numpad 2`: Press the left side circle button. (Speech Recognition Toggle)
- `Numpad 4`: Press the left side semi-circle button. (LeftMouse)
- `Numpad 5`: Press the center rectangle button. (Enter)
- `Numpad 6`: Press the right side semi-circle button. (RightMouse)
- `Numpad 7`: Press the right side circle button. (Eye Tracking Toggle)
- `Numpad 8`: Press the right side rectangle button (up). (ElementUp)
- `Numpad 9`: Press the right side rectangle button (down). (ElementDown)

- `Numpad *`: Unlock/Relock the keys.
