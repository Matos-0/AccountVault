import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import open from 'open';

import { CreateAccountDTO } from './application/dto/create-account.dto';

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, './data/accounts.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, async () => {
    console.log(`Server Starting in ttp://127.0.0.1:${PORT}`)
    try {
        await open(`http://127.0.0.1:${PORT}/index.html`);
    } catch (error) {
        console.error('The browser could not open automatically.:', error);
    }
});

interface Account {
    id: string;
    dominio: string
    email?: string
    user?: string
    password: string
    additional_info?: string
}

async function readAccounts(): Promise<Account[]> {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');

        return JSON.parse(data);

    } catch (error) {
        return [];
    }
}

async function writeAccounts(accounts: Account[]): Promise<void> {
    await fs.writeFile(
        FILE_PATH,
        JSON.stringify(accounts, null, 2),
        'utf-8'
    );
}

app.get('/accounts', async (req: Request, res: Response) => {
    try {

        const accounts = await readAccounts();

        const idAccount = req.query.id;
  
        if (idAccount) {
            const row = accounts.find(r => String(r.id) === String(idAccount));

            if (row) {
                return res.json(row);
            } else {
                return res.status(404).json({erro: "Account not found"})
            }
        }

        return res.json(accounts);

    } catch (error) {

        return res.status(500).json({
            error: 'Erro ao ler accounts'
        });

    }
});

app.post('/accounts', async (req: Request, res: Response) => {
    try {

        const body: CreateAccountDTO = req.body;

        if (!body.dominio) {
            return res.status(400).json({
                error: 'Domain field is required'
            });
        }

        const accounts = await readAccounts();

        const add_info = body.additional_info ?? "";
        const usr = body.user ?? "";
        const verified_email = body.email ?? "";

        const newAccount: Account = {
            id: Date.now().toString(),
            dominio: body.dominio,
            email: verified_email,
            user: usr,
            password: body.password,
            additional_info: add_info
        };

        accounts.push(newAccount);

        await writeAccounts(accounts);

        return res.status(201).json(newAccount);

    } catch (error) {

        return res.status(500).json({
            error: 'Erro ao salvar account'
        });

    }
});

app.put('/accounts/:id', async (req, res) => {

    try{
        
        const {id} = req.params;

        const newData = req.body;

        const account = await readAccounts();

        const accountIndex = account.findIndex(a => String(a.id) === String(id));

        if (accountIndex === -1) {
            return res.status(404).json({ error: 'account not found.' })
        }
        
        account[accountIndex] = {
            ...account[accountIndex],
            ...newData
        };

        await writeAccounts(account);
        
        return res.status(200).json(account[accountIndex])

    } catch (error) {

        console.error(error);

        res.status(500).json({error: "Error updating account."});
    }

});

app.delete('/accounts/:id', async (req, res) => {

    try{
        
        const {id} = req.params;

        const accounts = await readAccounts();

        const accountExists = accounts.some(a => String(a.id) == String(id));
        
        if (!accountExists) {
            return res.status(404).json({error: 'Account not found.'})
        }

        const filteredAccounts = accounts.filter(a => String(a.id) !== String(id))

        await writeAccounts(filteredAccounts);
        
        res.status(200).json({message: 'Account deleted.'})

    } catch (error ){
        console.error(error);
        res.status(500).json({error: "Error deleting account"})
    }

});

// listener
app.listen(PORT, () => {
    console.log(`Account Vault running...`);
});
