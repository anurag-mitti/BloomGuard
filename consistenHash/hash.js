const crypto = require('crypto');

class ConsistentHashing {
    constructor(nodes, vnodeCount = 4) {
        this.ring = new Map();
        this.sortedKeys = [];
        this.vnodeCount = vnodeCount;

        for (const node of nodes) {
            this.addNode(node);
        }
    }

    _hash(key) {
        const hash = crypto.createHash('sha256').update(key).digest('hex');
        return parseInt(hash.substring(0, 8), 16);
    }
    
    addNode(node) {
        for (let i = 0; i < this.vnodeCount; i++) {
            const vnodeKey = `${node}-${i}`;
            const hashKey = this._hash(vnodeKey);
            this.ring.set(hashKey, node);
        }
        this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
    }

    getNode(key) {
        if (this.sortedKeys.length === 0) {
            return null;
        }

        const hashKey = this._hash(key);
        
        const targetKey = this.sortedKeys.find(k => k >= hashKey);

        if (targetKey !== undefined) {
            return this.ring.get(targetKey);
        } else {
            return this.ring.get(this.sortedKeys[0]);
        }
    }
}

const nodes = ['serverA', 'serverB', 'serverC', 'serverD'];

const ch = new ConsistentHashing(nodes);

function decide(name)
{
    const ans=ch.getNode(name)
    // console.log(`key assinged to ${ans}`)
    return ans;
}



// console.log(decide("mitti"))

module.exports=decide;