export function setDatesOnSave(next) {
  console.log("Setting dates!")
  const currentDate = new Date();
  this.updatedAt = currentDate;

  if ( this.isNew ) {
    this.createdAt = currentDate;
  }

  if ( next ) return next()
}
