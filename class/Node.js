class Node {
  constructor(id,ip,port,miners,name) {
    this.id = id
    this.name = name
    this.ip = ip
    this.port = port                      
    this.miners  = miners      
    this.timestamp = new Date().getTime()
  }
}
module.exports = {
  Node
};