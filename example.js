
const assesmentPageSection = {
    section1: {
        header: "Take a Self-Assessment",
        para1: `<p class='text-sm text-center mb-5'>
                           RCI Certified Clinicians provide various tests and Assessments
                        </p>
    
                        <p class='text-sm text-center'>If you are looking for an psychological assessment reach out to your nearest clinic.
                         </p>`,
        AvailableTest: [
            {
                id: 1,
                title: "Take the PHQ-9 Test",
                title2: "Test for Depression",
                para: `This test helps evaluate the severity of depression symptoms.`,
                img: '/home/positive2.svg',
                link: '/assesment/phq9/selfAssesment'
            },
            {
                id: 2,
                title: "Take the GAD-7 Test",
                title2: "Test for Anxiety",
                para: `This test helps evaluate the severity of anxiety symptoms.`,
                img: '/home/positive3.svg',
                link: '/assesment/gad7/selfAssesment'
            },
            {
                id: 3,
                title: "Take the PSS-10 Test",
                title2: "Test for Stress",
                para: `This test assesses how stressful you find your life situations.`,
                img: '/home/positive4.svg',
                link: '/assesment/pss10/selfAssesment'
            },

        ],

    },
    section2: {
        header: "Not sure which test to take?",
        para: `<p class='text-center text-sm'>The K10 is designed to measure general psychological distress and can be an effective initial screening tool to identify whether you may need further assessment or support.  </p>`,
        defaultTest: {
            id: 4,
            title: "Take the K10 Test",
            title2: "K10 (Kessler Psychological Distress Scale)",
            para: `This test assesses the level of distress you have experienced in the past month. It helps identify symptoms of anxiety and depression, emotional and physical fatigue, and the impact on daily functioning. `,
            img: '/home/positive1.svg',
        },
    },
    section3: {
        blogs: [
            {
                id: 1,
                img: "dep1.svg",
                title: "TMS for Depression"
            },
            {
                id: 2,
                img: "",
                title: "TMS for OCD"
            },
            {
                id: 3,
                img: "",
                title: "TMS for Anxiety"
            },
        ],
        button: {
            text: "Learn More",
            link: "/",
        }
    }
}


const HomePageSections = {
    heroSection: {
        banner: "/home/banner01.png",
        title: "You Deserve to Feel Better ",
        para: `Get the best care from our experienced psychologists, TMS experts and psychiatrists for help with depression,OCD and more.
With empathy and confidence, our professionals will guide you through every challenge.`,
        button: {
            text: "SCHEDULE CONSULTATION",
            link: "/consultation/location",
        }
    },
    section2: {
        para1: `Not sure what you need?`,
        para2: `These tests can help identify
what you may have and need`,
        para2: `Take a FREE TEST to identify your symptoms`,
        html1: `
        

                    <h1 class='text-2xl text-center text-gray-800'>
                        Take a <span class="font-semibold">FREE TEST</span> to identify your symptoms
                    </h1>`,
        button: {
            text: "FREE TEST",
            link: "/assesment",
        }
    },
    section3: {
        title: "TMS Treatment",
        para1: `A new approach to treat depression, anxiety, OCD and more.`,
        box: {
            banner: "/home/doctor.png",
            para: `<p class='font-bold mb-3 text-gray-700 text-md'>NON-INVASIVE</p>
                    <p class='font-bold mb-3 text-gray-700 text-md'>NO MEDICATION</p>
                    <p class='font-bold mb-3 text-gray-700 text-md'>SAFE</p>
                    <p class='font-bold mb-3 text-gray-700 text-md'>US FDA Approved</p>`
        },
        para2: `<p style="font-size: 15px; color: #3A3A3A; text-align: center">At MindfulTMS, we bring 5+ years of TMS experience with 10+ clinics in India and USA.</p>

        <p style="font-size: 15px; color: #3A3A3A; text-align: center">Is TMS for me? Learn how it works and if it is the right option for you. </p>`,
        button: {
            text: "MORE ABOUT TMS",
            link: "/pages/tmsPage",
        }

    },
    section4: {
        header: `<h1 class='text-2xl font-[30px] text-center '>
                    Why choose <span class='font-semibold'>MindfulTMS?</span>
                </h1>`,
        para: `<p class='text-center'>
                    Your well being is our mission.
                </p>`,
        services: [
            {
                icon: '/home/medical.svg',
                text: 'Personalized care',
            },
            {
                icon: '/home/handshake.svg',
                text: 'Trust',
            },
            {
                icon: '/home/group.svg',
                text: 'Safe',
            },
            {
                icon: '/home/heart.svg',
                text: 'Holistic',
            },
        ]
    },
    section5: {
        header: 'Services we offer',
        services: [
            {
                array: [
                    {
                        img: "",
                        name: 'Therapy (Psychology)',
                    },
                    {
                        img: "",
                        name: 'Psychiatry ',
                    },
                    {
                        img: "",
                        name: 'Assessments',
                    },
                    {
                        img: "",
                        name: 'TMS',
                    },
                ],
                button: {
                    text: 'LEARN MORE',
                    link: '/services/Therapy Services'
                }
            },
        ]
    },
    section6: {
        header: 'Our Locations',
        para: `Lorem ipsum dolor sit amet`,
        locations: [
            {
                title: 'Bangalore',
                locationArray: [
                    {
                        title: "Aster CMI",
                        address: "Bangalore North",
                    },
                    {
                        title: "Whitefield",
                        address: "Bangalore East",
                    },
                ]
            },
            {
                title: 'Delhi',
                locationArray: [
                    {
                        title: "Greater Kailash",
                        address: "Delhi",
                    },

                ]
            },
        ]
    },
    section7: {
        header: 'Our Experts',
        expertArray: [
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },
            {
                img: '/home/doctor1.png',
                name: 'Dr.Sheela Rao',
                desig: 'Clinical Psychologist',
                location: 'Bangalore',
            },

        ]
    }
}



const blog = {
    "title": "A Journey Through the Mountains",
    "mainImage": "https://picsum.photos/200/300",
    "sections": [
        {
            "type": "content",
            "content": "<p>This is the first paragraph describing the journey.</p>",
            "order": 1
        },
        {
            "type": "image",
            "content": "https://picsum.photos/200/300",
            "order": 2
        },
        {
            "type": "content",
            "content": "<p>This section provides more details about the mountain ranges.</p>",
            "order": 3
        },
        {
            "type": "button",
            "text": "Read More",
            "link": "/",
            "order": 3
        },
        {
            "type": "accordion",
            "order": 4,
            "sections": [
                {
                    "type": "content",
                    "content": "<p>Details about the first part of the journey inside the accordion.</p>",
                    "order": 1
                },
                {
                    "type": "image",
                    "content": "https://picsum.photos/200/300",
                    "order": 2
                },
                {
                    "type": "content",
                    "content": "<p>Additional information inside the accordion section.</p>",
                    "order": 3
                }
            ],
        }

    ]
}


module.exports = { 
    HomePageSections, 
    assesmentPageSection, 
    blog ,
    
}