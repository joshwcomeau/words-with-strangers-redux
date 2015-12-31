export default function createdAndUpdatedAt(schema, { index = true }) {
  schema.add({
    createdAt: Date,
    updatedAt: Date
  });

  // Model hook. Will be triggered on every #save or #create call.
  schema.pre('save', function(next) {
    const currentDate = new Date();

    this.updatedAt = currentDate;
    if ( this.isNew && !this.createdAt ) this.createdAt = currentDate;

    return next();
  });

  // Query hook. Will be triggered on a Model.update() call.
  schema.pre('update', function(next) {
    if ( typeof this._update.$set === 'undefined' ) this._update.$set = {};
    this._update.$set.updatedAt = new Date()

    return next();
  });

  // Allow for indexing these fields.
  if ( index ) {
    schema.path('createdAt').index({ index });
    schema.path('updatedAt').index({ index });
  }
}
