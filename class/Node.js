class Node {
  constructor(id,ip,port,miners,name) {
    this.id = id
    this.name = name
    this.ip = ip
    this.port = port //default 21337
    this.miners  = miners      
    this.timestamp = new Date().getTime()
  }
}
module.exports = {
  Node
};