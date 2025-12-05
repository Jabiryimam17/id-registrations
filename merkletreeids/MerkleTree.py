import plyvel
from circomlibpy.poseidon import PoseidonHash
import shutil


FIELD_MODULUS = 21888242871839275222246405745257275088548364400416034343698204186575808495617



class MerkleTreeDB:
    def __init__(self, db_path):
        self.db = plyvel.DB(db_path, create_if_missing=True)
        self.poseidon = PoseidonHash()
        self.db_path = db_path
        self._initialize_db()

    def _initialize_db(self):
        if not self.db.get(b'root'):
            self.db.put(b'root', b'')
            self.db.put(b'total_leaves', b'\x00\x00\x00\x00')

    def _increment_leaves(self):
        count = int.from_bytes(self.db.get(b'total_leaves'), 'big') +1
        self.db.put(b'total_leaves', count.to_bytes(4, 'big'))
        return count - 1

    def add_leaf(self, leaf_hash:bytes):

        index = self._increment_leaves()
        self.db.put(f'leaf_index:{index}'.encode(), leaf_hash)
        self._rebuild_tree()
        return index

    def _rebuild_tree(self):

        leaf_count = int.from_bytes(self.db.get(b'total_leaves'), 'big')
        current_level = [int.from_bytes(self.db.get(f'leaf_index:{i}'.encode())) for i in range(leaf_count)]
        level = 1

        while len(current_level) > 1:
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else int.from_bytes(b'')
                node_hash_int:int = self.poseidon.hash(2,[left,right])
                node_hash:bytes = node_hash_int.to_bytes(32, 'big')

                self.db.put(f'node:{level}:{i // 2}'.encode(), node_hash)
                next_level.append(node_hash_int)
            current_level = next_level
            level += 1
        if current_level: self.db.put(b'root', current_level[0].to_bytes(32, 'big'))


    def get_merkle_path(self, leaf_hash:bytes):

        leaf_count = int.from_bytes(self.db.get(b'total_leaves'), 'big')
        for i in range(leaf_count):
            if self.db.get(f'leaf_index:{i}'.encode()) == leaf_hash:
                path, path_indices, actives = self._calculate_path(i)
                return {
                    "leaf": str(self.convert_to_num(self.db.get(f'leaf_index:{i}'.encode()))),
                    "path": path,
                    "path_indices": path_indices,
                    "actives": actives,
                    "merkle_root": str(self.convert_to_num(self.db.get(b'root')))
                }
        raise ValueError('Leaf not found')

    def _calculate_path(self, leaf_index):
        path = []
        indices = []
        current_idx = leaf_index
        for level in range(20):
            sibling_idx = current_idx ^ 1
            node_key = f'node:{level}:{sibling_idx}'.encode() if level !=0 else f'leaf_index:{sibling_idx}'.encode()
            if not self.db.get(node_key):
                if sibling_idx==1: break
                else :path.append(str(self.convert_to_num(b'')))
            else: path.append(str(self.convert_to_num(self.db.get(node_key))))
            indices.append(sibling_idx % 2)
            current_idx = current_idx // 2
        return self.pad_merkle_path(path, indices)

    def convert_to_num(self, value:bytes):
        path_element = int.from_bytes(value, 'big')
        return path_element%FIELD_MODULUS




    def pad_merkle_path(self, path, path_indices):
        if len(path) < 20:
            path.extend(["0"]*(20-len(path)))
            actives: list[int] = [1] * len(path_indices) + [0] * (20 - len(path_indices))
            path_indices.extend([0]*(20-len(path_indices)))

        return path, path_indices, actives

    def close(self):
        self.db.close()

    def clear_db(self):
        shutil.rmtree(self.db_path)



if __name__ == "__main__":
    merkle_tree.close()