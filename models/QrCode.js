var keystone = require('keystone'),
    appConstants = require('../lib/shared/constants'),
    Types = keystone.Field.Types;

/**
 * QRCode Model
 * ==========
 */

var QrCode = new keystone.List('QrCode', {
    autokey: { path: 'serialNumber', from: 'id', unique: true }
});

QrCode.add({
    serialNumber : { type: String, required: true, default: 1, unique: true},
    name : {type : String, default: 'Gi meg en tittel'},
    type : {type : String},

    // TODO: remove this (insert if not photo)
    image : {type : String, default : 'fantn_logo_lg.jpg'},

    // and use this instead
    photo : {type : Types.CloudinaryImage},
    description : {type: String, default: 'Fantn Item'},

    // bad name. should rename to available status
    selectedStatus : {type : String, default: appConstants.qrCodes.AVAILABLE},

    owner: { type: Types.Relationship, ref: 'User', index: true },
    created : {type: Types.Datetime, default: Date.now},
    prefix : {type: String, default: 'ZZ'}
});

QrCode.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

QrCode.schema.virtual('avatarUrl').get(function() {
	if (this.photo.exists) {
        return this._.photo.thumbnail(120,120);
    }
});

QrCode.register();

/*
[Display(Name = "Serienumer")]
public int SerialNumber { get; set; }

[Display(Name = "Namn")]
public string Name { get; set; }

[Display(Name = "Typ")]
public string Type { get; set; }

[Display(Name = "Beskrivning")]
public string Description { get; set; }

[Display(Name = "QRCode Bild")]
public byte[] QRLabelImage { get; set; }

[Display(Name = "Status")]
public string SelectedStatus { get; set; }

public IEnumerable<QRLabelIssuesModel> QRLabelIssuesSet { get; set; }

public IEnumerable<SelectListItem> StatusSet { get; set; }
*/
