# ROBLOX-Audio-Scheduler
Schedule when to upload an audio!

# Installation Tutorial

If you do not have typescript installed, follow these steps

## Typescript installation
Run the following commands in cmd/terminal in order, preferably as admin/root
```bash
npm install -g typescript
```

```bash
npm install -g ts-node
```

And that is it. Simple right?

## Installing depedencies

Just run the following command in cmd/terminal in order, preferably as admin/root. It will install all of the necessary dependencies
```bash
npm i
```

## Setup
You want to make a file called `env` in the root of the folder, with the following contents
```
BotToken=yourbottokenhere
```
Replace `yourbottokenhere` with your bot token. Capitals matter!

## Running the program

Just run the following command in cmd/terminal in order, preferably as admin/root, **while cd'd into the correct directory (where you installed the repo)**.
```bash
ts-node src/index.ts
```