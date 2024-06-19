export const menuItems = [
    {
        label: 'I-Ching-Engine Menu',
        isTitle: true,
    },
    {
        label: 'Home',
        icon: 'uil-home-alt',
        /* badge: {
            variant: "primary",
            text: "01"
        }, */
        link: '/',     
    },
    {
        label: 'I-Ching',
        icon: 'uil-eye',           
        subItems: [
            {
                label: 'Consult',
                link: '/consult/',                 
            },
            {
                label: 'Astrology',
                link: '/astrology/',                 
            },
            {
                label: 'Sequences',
                link: '/hexagram_sequence/',                 
            },
            {
                label: 'Hexagrams',
                link: '/hexagrams/',                 
            },
            {
                label: 'Trigrams',
                link: '/trigrams/',               
            },
        ],
    },

   ];
