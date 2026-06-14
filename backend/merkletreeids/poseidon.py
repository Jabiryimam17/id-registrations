from circomlibpy.poseidon import PoseidonHash
from nanoid import generate

poseidon = PoseidonHash()
inputs = [695663455759,1234]
print(generate("123456789abcdefghijklmnopqrstuvwxyz", 26))
num = 13757904303805936605921058902921419882305862824886602175210638398915720635961
bytes32_value = num.to_bytes(32, byteorder='big')
print(bytes32_value.hex())

result = poseidon.hash(2, inputs)
print("Python Poseidon result:", result)
