const ical = require('ical-generator');

const getIcalObjectInstance = (starttime, endtime, summary, description, email, name) => {
    const cal = ical({ domain: 'staurdays.com', name: 'HTO Appointment' });
    cal.method('REQUEST');
    cal.createEvent({
        method: 'request',
        start: starttime,
        summary: summary,
        description: description,
        sequence: 0,
        organizer: {
            name: 'Eyewear',
            email: 'hto@eyewear.com'
        },
        attendees:[
            {
                mailto : email,
                email : email,
                name : name,
                status : 'needs-action',
                rsvp : true,
                type : 'individual'
            },
            {
                mailto : 'hto@eyewear.com',
                email : 'hto@eyewear.com',
                name : 'Eyewear',
                status : 'needs-action',
                rsvp : true,
                type : 'individual'
            }
        ],
        status: 'confirmed'
    });
    return cal;
};

module.exports = {
    getIcalObjectInstance: getIcalObjectInstance
};
