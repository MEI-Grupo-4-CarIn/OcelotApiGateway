class User {
  constructor(firstName, lastName, email, password, birthDate, roleId, status, creationDateUtc, lastUpdateDateUtc) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
    this.roleId = roleId;
    this.status = status;
    this.creationDateUtc = creationDateUtc;
    this.lastUpdateDateUtc = lastUpdateDateUtc;
  }
}

module.exports = User;
