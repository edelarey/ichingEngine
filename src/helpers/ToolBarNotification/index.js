export default {
    createNotification(Icon, HeaderText, BodyText, CreateDate) {
        CreateDate = CreateDate || new Date();
        if (!Icon) {
            Icon = '';
        }
        let hasImage = true;
        // Switch statement for icons
        switch (Icon) {
            case 'hexagram': {
                HeaderText = 'Activity';
                Icon = require('@/assets/images/users/avatar-8.jpg');
                break;
            }
            case 'trigram': {
                HeaderText = 'Comment';
                Icon = require('@/assets/images/users/avatar-8.jpg');
                break;
            }
            default: {
                HeaderText = 'Message';
                Icon = require('@/assets/images/users/avatar-8.jpg');
            }
        }

        if (Icon.search('/') == -1) {
            hasImage = false;
        }
        return {
            Icon,
            showImage: hasImage,
            Header: HeaderText,
            eventText: BodyText,
            eventTime: CreateDate,
        };
    },
};
