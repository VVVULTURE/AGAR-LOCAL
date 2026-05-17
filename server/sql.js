/*
 * Lightweight JSON-based logger — replaces sqlite3 (no native compilation needed).
 * Logs are written to  data/chat.log  and  data/logins.log  as newline-delimited JSON.
 * The game itself does not depend on these logs at all; they are purely informational.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// /tmp is writable on all cloud platforms (Render, Koyeb, Railway, etc.)
// Local runs still work fine — /tmp exists everywhere.
const DATA_DIR = process.env.DATA_DIR || require('os').tmpdir() + '/agar-data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function appendLine(file, obj) {
    try {
        fs.appendFileSync(path.join(DATA_DIR, file), JSON.stringify(obj) + '\n');
    } catch (e) {
        console.error('[DB] Write error:', e.message);
    }
}

/* Emulate the minimal sqlite3 db.run() interface used by the repositories */
const db = {
    run(sql, params, cb) {
        try {
            if (sql.includes('chat_messages')) {
                appendLine('chat.log', {
                    username:   params[0],
                    message:    params[1],
                    ip_address: params[2],
                    timestamp:  params[3],
                });
            } else if (sql.includes('failed_login_attempts')) {
                appendLine('logins.log', {
                    username:   params[0],
                    ip_address: params[1],
                    timestamp:  Date.now(),
                });
            }
            if (cb) cb(null);
        } catch (e) {
            if (cb) cb(e);
        }
    }
};

module.exports = db;
