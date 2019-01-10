const { WritePacket, ReadPacket } = require('./Packets.js');
const { userRoleListScheme } = require('./schemes/userScheme.js');

class User {
	
	constructor(userId = null) {
		this.data = {};
		this.userId = userId || 32;
	}
	
	async getRoleList(userId = null) {
		let roleList;
		const packet = new WritePacket(29400);			
		packet.WriteUInt32(-1); 							  	// allways
		packet.WriteUInt32(userId || this.userId)		  		// userId
		packet.Pack(0xD49);							  			// pack opcode and length
		roleList = (new ReadPacket(await packet.Send()))
							.UnpackAll(userRoleListScheme)
							.base.roles;
		this.data.roleList = roleList;
		return roleList;
	}
	
	setGold(amount) {
		// Warning: this not add cubi/gold, this set the cubi/gold but instant!
		const packet = new WritePacket(29400);	
		packet.WriteUInt32(this.userId)					 		// which user account
		packet.WriteUInt32(amount)					 			// amount (100 = 1 gold)
		packet.Pack(0x209);							  			// pack opcode and length
		packet.Send();	
	}
}

module.exports = User;