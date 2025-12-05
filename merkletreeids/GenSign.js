import build_eddsa from "./helper/circomlibjs/src/eddsa.js";
import build_babyjub from "./helper/circomlibjs/src/babyjub.js";
import build_poseidon from "./helper/circomlibjs/src/poseidon_opt.js";
import build_pedersen from "./helper/circomlibjs/src/pedersen_hash.js";
import {
  li_buff_2_bits,
  li_int_2_bits,
  uint8_2_big_int,
} from "./helper/IntBuffConv.js";

import fs from "fs";


const priv_key_hex = "02e37613483ec697ed75cda05f14afb0723208ef1c53840b1f19650481014654";
const priv_key = Buffer.from(priv_key_hex, "hex");

async function main() {
  const [hid_str, sid_str] = process.argv.slice(2);
  const hid = BigInt(hid_str);
  const sid = BigInt(hid_str);

  const baby_jub = await build_babyjub();
  const eddsa = await build_eddsa();
  const poseidon = await build_poseidon();
  const pedersen = await build_pedersen();

  const pub_key = eddsa.prv2pub(priv_key);
  const msg_hash = poseidon([hid, sid]);

  const msg_num = uint8_2_big_int(msg_hash);
  const { R8, S } = eddsa.signPedersen(priv_key, msg_hash);

  const packed_A = baby_jub.packPoint(pub_key);
  const packed_R8 = baby_jub.packPoint(R8);
  const A_bits = li_buff_2_bits(packed_A);
  const R8_bits = li_buff_2_bits(packed_R8);
  const S_bits = li_int_2_bits(S, 256);

  const output = {
    R8: R8_bits,
    S: S_bits,
    A: A_bits,
    commitment: msg_num.toString(),
  };

  fs.writeFileSync(
    "C:\\Users\\Jabir\\PycharmProjects\\NationalIDSystem\\merkletreeids\\sig_input.json",
    JSON.stringify(output, null, 2)
  );
}

await main();
