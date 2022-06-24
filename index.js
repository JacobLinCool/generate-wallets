#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { Command } from "commander";
import { Wallet } from "ethers";

const pacakge_json = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const program = new Command();
program.version(pacakge_json.version);

program.option("-n, --number <number>", "Number of wallets to generate", parseInt, 8);
program.option("-o, --output <output>", "Output file, keep empty to print to stdout", "");

program.action(async () => {
    const number = program.opts().number;

    const wallets = [];

    for (let i = 0; i < number; i++) {
        const private_key = "0x" + randomBytes(32).toString("hex");
        const wallet = new Wallet(private_key);

        wallets.push({
            address: wallet.address,
            public: wallet.publicKey,
            private: wallet.privateKey,
        });
    }

    const json = JSON.stringify(wallets, null, 2);

    if (program.opts().output) {
        fs.writeFileSync(program.opts().output, json);
        console.log(`Wrote ${number} wallets to ${program.opts().output}`);
    } else {
        console.log(json);
    }
});

program.parse(process.argv);
