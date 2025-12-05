import random
import subprocess
import json
from circomlibpy.poseidon import PoseidonHash
from merkletreeids.MerkleTree import MerkleTreeDB



PUBLIC_SALT = 1234
NULLIFIER_TAG = 999999
MERKLE_TREE_LEVELS = 20
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617



class VoterRegister():

    def __init__(self, path):
        self.merkle_tree = MerkleTreeDB(path)
        self.poseidon_instance = PoseidonHash()

    def register_voter(self, official_id):
        sid = random.randint(0, 2**256)%p
        hid = self.poseidon_instance.hash(2,[official_id, PUBLIC_SALT])%p
        nullifier = self.poseidon_instance.hash(2,[sid, NULLIFIER_TAG])%p

        hid_bytes = hid.to_bytes(32, 'big')
        self.merkle_tree.add_leaf(hid_bytes)
        self.generate_signature(hid, sid)
        inputs = {"sid": sid, "nullifier": nullifier}
        with open("C:\\Users\\Jabir\\PycharmProjects\\NationalIDSystem\\merkletreeids\\sig_input.json", 'r+') as sig_file:
            signature = json.load(sig_file)
            inputs.update(signature)
            sig_file.seek(0)
            sig_file.truncate()
            return inputs
    
    def generate_signature(self,hid:int, sid:int):
        node_path = "node"
        js_script = "C:\\Users\\Jabir\\PycharmProjects\\NationalIDSystem\\merkletreeids\\GenSign.js"

        result = subprocess.run(
            [node_path, js_script, str(hid), str(sid)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode != 0: raise RuntimeError(f"JS Error: {result.stderr}")

    def generate_path(self, official_id):
        modified_official_id = official_id % (2**256)  # Ensure official_id fits in 256 bits
        hid = self.poseidon_instance.hash(2, [modified_official_id, PUBLIC_SALT])
        hid_bytes = hid.to_bytes(32, 'big')
        merkle_path = self.merkle_tree.get_merkle_path(hid_bytes)
        return merkle_path


if __name__ == "__main__":
    Registral = VoterRegister("C:\\Users\\Jabir\\PycharmProjects\\NationalIDSystem\\ids_tree")
    print((Registral.merkle_tree.db.get(b'root').hex()))
    print(Registral.merkle_tree.db.get(b'total_leaves').hex())
    # print(Registral.generate_path(275691198376))
    # Registral.register_voter(644963631259)
