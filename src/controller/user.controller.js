import { db } from "../db/connectDb.js";

//We define the code logic here
const identifyUser = async function (req, res) {
    const { email, phoneNumber } = req.body;

    //If email and phone number both are missing
    if (!email && !phoneNumber) {
        return res.status(400).json({
            error: 'Hey there, you have to enter either you email or phone number to move forward :)'
        })
    }

    let result = [];
    try {

        //If we have either one of them 
        if (email && phoneNumber) {
            [result] = await db.execute(`SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`, [email, phoneNumber]);
        } else if (email) {
            [result] = await db.execute(`SELECT * FROM Contact WHERE email = ?`, [email]);
        } else if (phoneNumber) {
            [result] = await db.execute(`SELECT * FROM Contact WHERE phoneNumber = ?`, [phoneNumber]);
        }

        //If there is a primary entry
        if (result.length === 0) {
            const [insertResult] = await db.execute(`INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, 'primary')`, [email, phoneNumber]);
            const newContactId = insertResult.insertId;
            return res.status(200).json({
                contact: {
                    primaryContactId: newContactId,
                    emails: [email].filter(Boolean),
                    phoneNumbers: [phoneNumber].filter(Boolean),
                    secondaryContactIds: []
                }
            });
        }

        //Else if we have a same contact for primary as well as for secondary
        result = result.filter(contact => !contact.deletedAt);

        const primaryContact = result.find(contact => contact.linkPrecedence === 'primary');
        const secondaryContacts = result.filter(contact => contact.linkPrecedence === 'secondary');

        if (primaryContact) {
            const primaryContactId = primaryContact.id;
            const emails = new Set();
            const phoneNumbers = new Set([primaryContact.phoneNumber]);
            const secondaryContactIds = secondaryContacts.map(contact => contact.id);

            if (primaryContact.email) {
                emails.add(primaryContact.email);
            }

            // Add secondary contact emails
            secondaryContacts.forEach(contact => {
                if (contact.email) emails.add(contact.email);
                if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
            });


            secondaryContacts.forEach(contact => {
                if (contact.email) emails.add(contact.email);
                if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
            });

            if (!result.some(r => r.email === email && r.phoneNumber === phoneNumber)) {
                const [insertResult] = await db.execute(`INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, 'secondary')`, [email, phoneNumber, primaryContactId]);
                secondaryContactIds.push(insertResult.insertId);
                if (email) emails.add(email);
                if (phoneNumber) phoneNumbers.add(phoneNumber);
            }

            return res.status(200).json({
                contact: {
                    primaryContactId,
                    emails: Array.from(emails),
                    phoneNumbers: Array.from(phoneNumbers),
                    secondaryContactIds
                }
            });
        } else {
            return res.status(404).json({
                error: 'Primary contact not found'
            });
        }
    } catch (error) {
        console.error(`Error inserting in the DB ${error.message}`);
        return res.status(500).json({
            error: "It's not you, It's us :( , Grab a cup of coffee while we fix it right away! :D"
        })
    }
}

export { identifyUser }


