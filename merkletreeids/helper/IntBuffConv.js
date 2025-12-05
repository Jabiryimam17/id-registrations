import build_babyjub from "./circomlibjs/src/babyjub.js";
import {Scalar} from "ffjavascript";

export function li_int_2_bits(num,n) {
    num = BigInt(num);
    const bits = new Array(n).fill(0);
    let index = 0;
    while (num > 0) {
        bits[index++] = Number(num & 1n);
        num >>= 1n;
    }
    return bits;
}

export function uint8_2_big_int(nums) {
    nums[31] = nums[31] & 0x3F;
    let num = 0n;
    for (let i=0; i < 32; i++) {
        num += BigInt(nums[i]) << BigInt(i*8);
    }
    return num;
}

export function li_buff_2_bits(buff) {
    const flattened_bits = [];
    for (let byte of buff) {
        for (let i = 0; i < 8; i++) {  // Process LSB first
            flattened_bits.push((byte >> i) & 1);
        }
    }
    return flattened_bits;
}


export async function validate_point(point) {
    const baby_jub = await build_babyjub();

    const F = baby_jub.F;

    const px = F.toObject(point[0])
    const py = F.toObject(point[1])
    const p_scalar = Scalar.fromString(baby_jub.p.toString())

    if (Scalar.geq(px,p_scalar)) throw new Error("x coordinate too large")
    if (Scalar.geq(py, p_scalar)) throw new Error("y coordinate too large")

    const x_2 = F.square(point[0])
    const y_2 = F.square(point[1])

    const lhs = F.add(F.mul(baby_jub.A, x_2), y_2)
    const rhs = F.add(F.one, F.mul(F.mul(baby_jub.D, x_2), y_2))

    if (!F.eq(lhs, rhs)) throw new Error("Point not on curve")
}

export function bits_2_buffer(bits) {
    const bytes=new Uint8Array(32);
    for (let i=0; i < 32; i++) {
        let byte = 0;
        for (let j = 0; j < 8; j++) {
            byte |= bits[i * 8 + j] << j;
        }
        bytes[i] = byte;
    }
    return bytes;
}