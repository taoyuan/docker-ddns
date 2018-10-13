const fse = require('fs-extra');
const {exec} = require('child-process-promise');
const ipify = require('ipify');
const df = require('dateformat');

const regip = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

const ipfile = '/data/dnm/ip.json';
const cmd = 'dnu -c /data/dnm/domains.yml';

const CHECK_INTERVAL = 60000; // 1 minute

let counter = 0;

exports.main = function main() {
  log('start');
  schedule(check, CHECK_INTERVAL);
};

function schedule(fn, timeout) {
  let t = setImmediate(run);

  async function run() {
    t = null;
    await fn();
    t = setTimeout(run, timeout);
  }

  return {
    cancel: () => {
      t && clearTimeout(t);
      t = null;
    }
  }
}

async function check() {
  const now = Date.now();
  let data = await read();

  // too quick
  if (data && data.ts && data.ts + 10000 > now) {
    return;
  }

  try {
    const ip = await ipify();
    if (!regip.test(ip)) {
      return log(ip, 'is not valid ip address. ignore');
    }

    if (!data || data.ip !== ip || (++counter >= 5)) {
      log(`update ${data ? data.ip : '0.0.0.0'} => ${ip}`);
      await exec(cmd);
      data = {ip, ts: now};
      await write(data);
      log('updated', JSON.stringify(data));
      counter = 0;
    }
  } catch (e) {
    log('Error:', e.message);
  }
}

function log(...args) {
  console.log(`${df(Date.now(), 'yyyy-mm-dd HH:MM:ss')} -`, ...args);
}

async function read() {
  if (fse.existsSync(ipfile)) {
    return fse.readJSON(ipfile, {throws: false});
  }
}

async function write(data) {
  await fse.writeJSON(ipfile, data);
}