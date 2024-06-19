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

3. Rebuild dependencies
> This step is necessary because some dependencies are native modules and need to be rebuilt for the current platform - namely electron.
```bash
npm run rebuild
```

4. Start the development server
```bash
npm run dev
```