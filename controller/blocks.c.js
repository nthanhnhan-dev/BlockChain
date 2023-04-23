
const hash=require('crypto-js/sha256');
const he = require('he');
class Block{
    constructor(preHash,data){
        this.preHash=preHash;
        this.data=data;
        this.timeStamp=new Date();
        this.hash=this.calculateHash();
        this.mineVar=0;
    }

    printObjectstring(){
        return (this.preHash+'\n'+this.data.from+'\n'+this.data.to+'\n'+this.data.category+'\n'+this.data.amount+'\n'+this.timeStamp+'\n'+this.hash).toString();
    }

    calculateHash(){
        return hash(this.preHash+JSON.stringify(this.data)+this.timeStamp+this.mineVar).toString();
    }

    mine(difficulty){
        while(!this.hash.startsWith('0'.repeat(difficulty))){
            this.mineVar++
            this.hash=this.calculateHash()
        }
    }

}


class BlockChain {
    constructor(hardlevel){
        const orginBlock=new Block('00000',{isOrigin:true})
        this.chain=[orginBlock];
        this.difficulty=hardlevel
    }
    
    getlastBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newdata){
        const lastblock=this.getlastBlock();
        const newblock=new Block(lastblock.hash,newdata);

        console.log('start')
        console.time('mine')
        newblock.mine(this.difficulty)
        console.timeEnd('mine')
        console.log('end')
        console.log("New block: ",newblock.preHash)
        this.chain.push(newblock);
    }

    checkintegrityData(){
        for (let i=1;i <this.chain.length;i++){
            const curBlock=this.chain[i];
            const preBlock=this.chain[i-1];

            if(curBlock.preHash != preBlock.hash){
                return false;
            }

            if(curBlock.hash != curBlock.calculateHash()){
                return false;
            }
        }
        return true;
    }
}  





exports.createBlockChain=async(req,res,next)=>{
    const blockchain=new BlockChain(3)
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "300000",
        amount:"no limit",
        count:1
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "20000000",
        amount:"no limit",
        count:2
    })
    blockchain.addBlock({
        from: "Nguyen Thanh Nhan",
        to: "Tran thi Kim Tien",
        category: "10000000",
        amount:"no limit",
        count:3
    })
    console.log(blockchain.chain)
    //console.log(blockchain.chain[1].printObjectstring())
    //blockchain.chain=blockchain.chain.map(member=>JSON.stringify(member))
    res.render('./blockchain/blockchain',{
        data: blockchain.chain,
        n: blockchain.chain.length
    })

}