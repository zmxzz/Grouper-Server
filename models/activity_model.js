const mongoose = require('mongoose');

// Activity Schema
const ActivitySchema = mongoose.Schema({
    activityName: {
        type: String,
        required: true
    },
    introduction: {
        type: String
    },
    category: {
        type: String
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    hour: {
        type: Number,
        required: true
    },
    minute: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: [
                'Alabama',
                'Alaska',
                'Arizona',
                'Arkansas',
                'California',
                'Colorado',
                'Connecticut',
                'Delaware',
                'Florida',
                'Georgia',
                'Hawaii',
                'Idaho',
                'Illinois',
                'Indiana',
                'Iowa',
                'Kansas',
                'Kentucky',
                'Louisiana',
                'Maine',
                'Maryland',
                'Massachusetts',
                'Michigan',
                'Minnesota',
                'Mississippi',
                'Missouri',
                'Montana',
                'Nebraska',
                'Nevada',
                'New Hampshire',
                'New Jersey',
                'New Mexico',
                'New York',
                'North Carolina',
                'North Dakota',
                'Ohio',
                'Oklahoma',
                'Oregon',
                'Pennsylvania',
                'Rhode Island',
                'South Carolina',
                'South Dakota',
                'Tennessee',
                'Texas',
                'Utah',
                'Vermont',
                'Virginia',
                'Washington',
                'West Virginia',
                'Wisconsin',
                'Wyoming'
            ],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    groupSize: {
        type: Number,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    images: [{
        type: String
    }]
});

// Export Activity Model
const Activity = module.exports = mongoose.model('Activity', ActivitySchema);

// Save activity to database
module.exports.save = function(activity) {
    let save = new Promise((resolve, reject) => {
        activity.save((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return save;
};

// Find activity by id
module.exports.getActivityById = function(activityId) {
    let getActivityById = new Promise((resolve, reject) => {
        const query = { _id: activityId };
        Activity.find(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return getActivityById;
};

// Find activities by organizer id list
// organizerIdList: list of string representing organizer's list
module.exports.getActivityByOrganizerIdList = function(organizerIdList) {
    let getActivityByOrganizerIdList = new Promise((resolve, reject) => {
        const query = {organizer: { $in: organizerIdList}};
        Activity.find(query, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
    return getActivityByOrganizerIdList;
}

// Delete activity by activityId
module.exports.deleteActivityById = function(activityId) {
    let deleteActivityById = new Promise((resolve, reject) => {
        Activity.deleteOne({ _id: activityId }, function (error) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve();
            }
          });
    });
    return deleteActivityById;
}