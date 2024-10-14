/**
 * hexagram.js
 * @IExplanation(name = "Hexagram",
description="Enumeration representing the Hexagrams BaGua in Fu Xi Sequence Binary Order i.e. Ascending Binary Value with rightmost digit = LSB (least significant bit)" +
			"When drawing the hexagram, the order of righting to the console forces a reversal in the order the hexagram is rendered. as read from bottom up" +
			"Mapping of binary to king wen sequence: http://www.biroco.com/yijing/sequence.htm")
@IReference(title = "A Companion To Yi Jing Numerology and Cosmology", "https://en.wikibooks.org/wiki/I_Ching/Explanation_Of_I_Ching_Hexagrams_And_Lines"
author= "Nielsen, B",
date= "2003",
publisher = "Element",
page ="3",
description = "Usage: The PRIMARY naming of the hexagrams as enumerations and the placing of hexagrams into palaces."
			+ " - Duplicate Names: When a hexgram name is in common between 2 different Hexagrams, the first occurrence of the Hexgram"
			+ "    in binary terms is CAPITALISED, unless the conflict involves a hexagram named after its two inner trigrams which bear the same name. "
			+ "    in which case it is CAPITALISED as in the case of QIAN (qian, qian)"
			+ " - If a name consists of two words, an underscore separates the words.")
 */
import bagua from '@/const/bagua';

const hexagram = {
    kūn: {
        name: `kūn, k'un`,
        symbol: '坤', 
        hexagram: '䷁',
        binary: '000000',
        order: 0, 
        kingwen:2, 
        translation: 'The Receptive',  
        summary: `This hexagram symbolizes the power of receptivity and nurturing. It advises you to be open to new ideas and to listen to the needs of others. It encourages you to create a safe and supportive environment for growth and transformation. This hexagram symbolizes openness, patience, and the willingness to follow rather than lead. It advises embracing humility and allowing things to unfold naturally`,
        above: bagua.bagua.kūn,
        below: bagua.bagua.kūn,
        explanation: `Kūn represents the receptive, yielding energy that nurtures growth. It symbolizes patience, openness, and the power of support.`,
        judgement: `The Receptive brings about great success through its willingness to follow and adapt. Yielding to the circumstances allows the development of all potential.`,
        image: `The image of Kūn is the earth nurturing all beings. The wise person aligns with nature, providing support and nourishment to those around them.`,
        lines: `- **Line 1:** Stay grounded in humility; readiness is not yet needed.  
        - **Line 2:** Being supportive and receptive leads to stability.  
        - **Line 3:** Patience tested; do not rush progress.  
        - **Line 4:** Trust in inner strength to guide actions.  
        - **Line 5:** Honor brings the ability to lead and support effectively.  
        - **Line 6:** Extreme yielding can result in missed opportunities.`
    },
    bō: {
        name: 'bō, po',
        symbol: '剝', 
        hexagram: '䷖',
        binary: '100000',
        order: 1, 
        kingwen:23,  
        translation: 'Splitting Apart',         
        summary: `This hexagram symbolizes the need to let go of what no longer serves you. It advises you to release old patterns and beliefs that are holding you back and to make space for new growth and opportunities. This hexagram indicates a time of breakdown and separation. It suggests letting go of what no longer serves you and preparing for transformation.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.kūn,
        explanation: `Bō represents decay and disintegration. It signals a time when things fall apart due to instability or lack of solid foundations.`,
        judgement: `Splitting apart warns of a need to let go of what is no longer viable. By accepting that some things must end, one can make way for renewal and new growth.`,
        image: `The image of Bō is the mountain over the earth, signifying collapse. The wise person accepts impermanence and focuses on rebuilding stronger foundations.`,
        lines: `- **Line 1:** Address minor issues before they cause greater damage.  
        - **Line 2:** Maintain composure amidst decay.  
        - **Line 3:** Letting go of the past leads to freedom.  
        - **Line 4:** Rely on inner strength when external supports fail.  
        - **Line 5:** Endings bring the opportunity for new beginnings.  
        - **Line 6:** Complete separation may be painful but necessary.`
    },
    bǐ: {
        name: 'bǐ, pi',
        symbol: '比', 
        hexagram: '䷇',
        binary: '010000',
        order: 2, 
        kingwen:8,        
        translation: 'Holding Together (Union)', 
        summary: `This hexagram symbolizes the need to work together and cooperate with others. It advises you to put aside your differences and focus on what you have in common. This hexagram highlights the value of solidarity, loyalty, and mutual support. It encourages building relationships based on trust and shared goals.`,  
        above: bagua.bagua.kǎn,
        below: bagua.bagua.kūn,
        explanation: `Bǐ emphasizes unity and solidarity. It highlights the importance of gathering people and resources to achieve common goals.`,
        judgement: `Holding Together brings strength and stability. By fostering trust and mutual support, greater achievements are possible.`,
        image: `The image of Bǐ is water gathering on the earth, symbolizing unity. The wise person cultivates connections and strengthens bonds with others.`,
        lines: `- **Line 1:** Seek those who share your values and goals.  
        - **Line 2:** Mutual support is key to overcoming challenges.  
        - **Line 3:** Be cautious of false unity; seek genuine connections.  
        - **Line 4:** A strong alliance requires commitment and trust.  
        - **Line 5:** Unity brings strength to all endeavors.  
        - **Line 6:** Lack of cooperation leads to isolation; seek reconciliation.`
    },
    guān: {
        name: 'guān, kuan',
        symbol: '觀', 
        hexagram: '䷓',
        binary: '110000',
        order: 3, 
        kingwen:20,        
        translation: 'Contemplation (View)', 
        summary: `This hexagram symbolizes the need to take a step back and observe. It advises you to take a detached view of the situation and to consider the bigger picture before making a decision. his hexagram calls for a period of introspection and observation. It advises taking a step back to gain a broader perspective before taking action.`,  
        above: bagua.bagua.xùn,
        below: bagua.bagua.kūn,
        explanation: `Guān signifies the act of contemplation and the need for clear vision. It represents a time to observe carefully, to gain understanding through patience and reflection.`,
        judgement: `Contemplation brings insight and clarity. By observing the situation from different angles, one can uncover hidden truths and make well-informed decisions.`,
        image: `The image of Guān is the wind over the earth, symbolizing a broad perspective. The wise person reflects deeply and gains wisdom by seeing the bigger picture.`,
        lines: `- **Line 1:** Contemplation begins with self-reflection.  
        - **Line 2:** Seek guidance from those with experience and wisdom.  
        - **Line 3:** Avoid superficial judgments; look beneath the surface.  
        - **Line 4:** Understanding leads to influence over others.  
        - **Line 5:** Contemplation from a position of authority brings respect.  
        - **Line 6:** Remain detached to see the truth more clearly.`
    },
    yù: {
        name: 'yù, yu',
        symbol: '豫', 
        hexagram: '䷏',
        binary: '001000',
        order: 4,   
        kingwen:16, 
        translation: 'Enthusiasm', 
        summary: `This hexagram symbolizes the need to approach life with enthusiasm and optimism. It advises you to embrace new opportunities and to pursue your goals with passion and energy. This hexagram represents the energy of excitement and the drive to take action. It advises channeling enthusiasm into constructive projects.`,              
        above: bagua.bagua.zhèn,
        below: bagua.bagua.kūn,
        explanation: `Yù represents the energy of enthusiasm and joyful anticipation. It signifies the power to inspire and mobilize others toward a common goal.`,
        judgement: `Enthusiasm generates momentum and success. With the right motivation and clear vision, it is possible to lead others and bring projects to fruition.`,
        image: `The image of Yù is thunder emerging from the earth, symbolizing the surge of energy. The wise person channels enthusiasm into constructive action.`,
        lines: `- **Line 1:** Small sparks of enthusiasm grow into larger flames.  
        - **Line 2:** Keep a steady pace to sustain the excitement.  
        - **Line 3:** Avoid acting out of blind passion; temper your energy.  
        - **Line 4:** A well-directed effort brings joyful results.  
        - **Line 5:** Shared enthusiasm unites people towards a goal.  
        - **Line 6:** Overexertion can lead to burnout; seek balance.`
    },
    jìn: {
        name: 'jìn, chin',
        symbol: '晉', 
        hexagram: '䷢',
        binary: '101000',
        order: 5, 
        kingwen:35,        
        translation: 'Progress',   
        summary: `This hexagram symbolizes progress and growth. It advises you to keep moving forward and to stay focused on your goals. It encourages you to take action and to keep pushing yourself. This hexagram represents a time of success and forward movement. It encourages seizing opportunities and making visible achievements.`,
        above: bagua.bagua.lí,
        below: bagua.bagua.kūn,
        explanation: `Jìn represents progress and the forward movement of goals and ambitions. It indicates a time of advancement and success through clarity of purpose.`,
        judgement: `Progress is made through clarity, vision, and the support of others. By acting with sincerity and maintaining a positive outlook, success is within reach.`,
        image: `The image of Jìn is the sun rising over the earth, symbolizing enlightenment and growth. The wise person seizes opportunities to advance toward their goals.`,
        lines: `- **Line 1:** Gradual progress lays a strong foundation.  
        - **Line 2:** Success through collaboration and mutual support.  
        - **Line 3:** Stay focused to avoid losing momentum.  
        - **Line 4:** Move forward with clear vision and confidence.  
        - **Line 5:** True progress comes from patience and effort.  
        - **Line 6:** Rapid success must be handled with care to sustain it.`
    },
    cui: {
        name: `cui, ts'ui`,
        symbol: '萃', 
        hexagram: '䷬',
        binary: '011000',
        order: 6,   
        kingwen:45,      
        translation: 'Gathering Together',   
        summary: `This hexagram symbolizes the power of coming together as a group. It advises you to work with others and to combine your strengths to achieve your goals. It encourages you to collaborate and cooperate with those around you.  This hexagram signifies the power of bringing people or resources together for a common cause. It advises building community and focusing on shared goals to achieve success.`,
        above: bagua.bagua.duì,
        below: bagua.bagua.kūn,
        explanation: `Cuì represents the concept of gathering together and collective effort. It highlights the importance of unity, shared purpose, and the strength that comes from working as a group.`,
        judgement: `Gathering together is most effective when led by a common purpose. Success comes from the unity of intention and the support of the collective in achieving shared goals.`,
        image: `The image of Cuì is the lake above the earth, symbolizing a place of gathering and connection. The wise person inspires others to come together in harmony and cooperation.`,
        lines: `- **Line 1:** Start gathering strength with small groups.  
        - **Line 2:** Harmonize with others to strengthen your position.  
        - **Line 3:** Beware of forces that might scatter the group.  
        - **Line 4:** Leading others with sincerity earns loyalty.  
        - **Line 5:** True unity comes from shared values and goals.  
        - **Line 6:** Allow the group to disperse naturally when the time is right.`
    },
    pǐ: {
        name: `pǐ, p'i`,
        symbol: '否', 
        hexagram: '䷋',
        binary: '111000',
        order: 7,
        kingwen:12,
        translation: 'Standstill (Stagnation)',            
        summary: `This hexagram symbolizes a period of stagnation and lack of progress. It advises you to be patient and to wait for the right time to act. It encourages you to take a step back and to re-evaluate your goals and priorities. This hexagram signifies a time when progress is halted and obstacles are present. It advises patience, acceptance, and waiting for the right conditions to change.`,
        above: bagua.bagua.qián,
        below: bagua.bagua.kūn,
        explanation: `Pǐ represents a time of stagnation and imbalance, where the flow of energy is blocked. It suggests obstacles and a lack of progress in current endeavors.`,
        judgement: `Stagnation creates difficulty and disunity. When faced with obstacles, it is wise to retreat, reorganize, and focus on self-improvement until conditions change.`,
        image: `The image of Pǐ is heaven and earth moving apart, symbolizing disconnection. The wise person conserves energy and avoids unnecessary actions during this time.`,
        lines: `- **Line 1:** Accept limitations and wait for better opportunities.  
        - **Line 2:** Find contentment in small gains during hard times.  
        - **Line 3:** Misfortune arises if you struggle against the current.  
        - **Line 4:** Seek guidance and trust your inner strength.  
        - **Line 5:** The ability to influence change begins to reappear.  
        - **Line 6:** Be ready to seize new opportunities as the stagnation ends.`
    },
    qiān: {
        name: `qiān, ch'ien`,
        symbol: '謙', 
        hexagram: '䷎',
        binary: '000100',
        order: 8,   
        kingwen:15,   
        translation: 'Modesty',      
        summary: `This hexagram symbolizes the power of humility and modesty. It advises you to approach life with an open mind and a willingness to learn from others. It encourages you to be humble and to treat others with respect. This hexagram highlights the value of modesty, self-awareness, and maintaining balance. It encourages staying grounded even in times of success.`,
        above: bagua.bagua.kūn,
        below: bagua.bagua.gèn,
        explanation: `Qiān emphasizes the virtue of modesty and humility. It teaches that true greatness is expressed through simplicity and self-restraint.`,
        judgement: `Modesty leads to success. By remaining humble and grounded, even in moments of achievement, one gains the respect and trust of others.`,
        image: `The image of Qiān is the earth below the mountain, representing humility. The wise person keeps a low profile and places value on inner strength.`,
        lines: `- **Line 1:** Humility in small matters builds strength for greater things.  
        - **Line 2:** True modesty is naturally respected by others.  
        - **Line 3:** Balance your actions with restraint to avoid excess.  
        - **Line 4:** Modesty shines through genuine accomplishments.  
        - **Line 5:** Staying humble while in a high position brings honor.  
        - **Line 6:** Overemphasis on modesty can lead to self-neglect.`
    },
    gèn: {
        name: 'gèn, ken',
        symbol: '艮', 
        hexagram: '䷳',
        binary: '100100',
        order: 9,   
        kingwen:52,  
        translation: ' Keeping Still, Mountain',       
        summary: `This hexagram symbolizes the power of stillness and stability. It advises you to be patient and to stay grounded in the face of challenges. It encourages you to stand firm in your beliefs and to remain true to yourself. This hexagram focuses on stability and the ability to remain calm and centered. It suggests practicing self-control and inner peace, regardless of external events.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.gèn,
        explanation: `Gēn represents stillness, contemplation, and the importance of grounding oneself. It emphasizes the need for patience and reflection before taking action.`,
        judgement: `Keeping still encourages a pause for introspection and careful consideration. By cultivating inner calm, one can develop clarity and insight that guides future actions.`,
        image: `The image of Gēn is a mountain, symbolizing stability and tranquility. The wise person embraces stillness to gather strength and wisdom before proceeding.`,
        lines: `- **Line 1:** Embrace quiet moments to find clarity in your thoughts.  
        - **Line 2:** Reflect on past actions to inform future decisions.  
        - **Line 3:** Balance activity with moments of stillness for overall well-being.  
        - **Line 4:** Solid foundations support future growth; take your time.  
        - **Line 5:** Inner peace leads to wise decisions and effective action.  
        - **Line 6:** Too much stillness can lead to stagnation; seek balance.`
    },
    jiǎn: {
        name: 'jiǎn, chien',
        symbol: '蹇', 
        hexagram: '䷦',
        binary: '010100',
        order: 10,
        kingwen:39,         
        translation: 'Chien / Obstruction',   
        summary: `This hexagram symbolizes the power of overcoming obstacles and challenges. It advises you to face your fears and to push through difficulties. It encourages you to stay focused on your goals and to keep moving forward. This hexagram highlights the challenges that block your path. It suggests seeking help from others and approaching the problem from a different angle.`,
        above: bagua.bagua.kǎn,
        below: bagua.bagua.gèn,
        explanation: `Jiǎn represents obstacles and challenges that hinder progress. It advises careful planning, perseverance, and sometimes taking a step back to reassess the situation.`,
        judgement: `Obstruction calls for patience and strategy. Recognize the difficulties ahead and use them as opportunities for growth by approaching the situation with a clear mind and steady resolve.`,
        image: `The image of Jiǎn is water on the mountain, symbolizing a barrier that requires careful navigation. The wise person remains patient and seeks the right moment to move forward.`,
        lines: `- **Line 1:** Accept minor setbacks to avoid larger issues.  
        - **Line 2:** Seek help from others to overcome obstacles.  
        - **Line 3:** Understand your limitations and act accordingly.  
        - **Line 4:** Perseverance leads to gradual progress.  
        - **Line 5:** Overcoming hardship strengthens your character.  
        - **Line 6:** Avoid unnecessary struggles; wait for better conditions.`
    },
    jiàn: {
        name: 'jiàn, chien',
        symbol: '漸', 
        hexagram: '䷴',
        binary: '110100',
        order: 11, 
        kingwen:53,  
        translation: 'Development (Gradual Progress)', 
        summary: `This hexagram symbolizes the power of gradual progress and growth. It advises you to take small steps towards your goals and to be patient with yourself. It encourages you to focus on the journey rather than the destination.  This hexagram represents steady development through patience and commitment. It advises taking a long-term view and trusting that progress will come with time.`,          
        above: bagua.bagua.xùn,
        below: bagua.bagua.gèn,
        explanation: `Zhǔ symbolizes gradual progress and the importance of steady development over time. It encourages patience and continuous effort toward long-term goals.`,
        judgement: `Development emphasizes the value of nurturing growth patiently. By investing time and energy, one can achieve meaningful progress and cultivate lasting success.`,
        image: `The image of Zhǔ is a tree growing steadily, representing resilience and patience. The wise person nurtures their goals over time, allowing them to blossom naturally.`,
        lines: `- **Line 1:** Begin development with small, manageable steps.  
        - **Line 2:** Seek guidance from mentors to facilitate growth.  
        - **Line 3:** Persistence pays off in the long run; stay focused.  
        - **Line 4:** Adapt your methods as circumstances change.  
        - **Line 5:** Support others in their development to enhance your own.  
        - **Line 6:** Recognize the signs of maturity; do not rush the process.`
    },
    xiǎoguò: {
        name: 'xiǎo guò, hsiao kuo',
        symbol: '小過', 
        hexagram: '䷽',
        binary: '001100',
        order: 12, 
        kingwen:62, 
        translation: 'Preponderance of the Small', 
        summary: `This hexagram symbolizes the power of small actions and incremental changes. It advises you to pay attention to the details and to take small steps towards your goals. It encourages you to be patient and to trust that your efforts will pay off in the long run. This hexagram advises focusing on small matters and making minor adjustments rather than taking bold actions. It suggests careful steps to avoid mis-steps.`,        
        above: bagua.bagua.zhèn,
        below: bagua.bagua.gèn,
        explanation: `Xiǎo Guó emphasizes the significance of small actions and details. It suggests that minor influences can lead to substantial outcomes when approached with care and diligence.`,
        judgement: `The preponderance of the small suggests focusing on the little things that matter. By attending to details, one can create a solid foundation for greater achievements.`,
        image: `The image of Xiǎo Guó is a small stream flowing steadily, representing the power of gradual progress. The wise person understands that every small effort contributes to larger goals.`,
        lines: `- **Line 1:** Minor efforts yield positive results; do not underestimate them.  
        - **Line 2:** Cultivate small relationships to strengthen your network.  
        - **Line 3:** Attention to detail prevents larger problems later.  
        - **Line 4:** Small contributions can lead to collective success.  
        - **Line 5:** Recognize the value of subtle influences; they matter.  
        - **Line 6:** Balance small actions with larger goals for success.`
    },
    lǚ: {
        name: 'lǚ, lü',
        symbol: '旅', 
        hexagram: '䷷',
        binary: '101100',
        order: 13,  
        kingwen:56, 
        translation: 'The Wanderer',       
        summary: `This hexagram symbolizes the power of exploration and discovery. It advises you to embrace new experiences and to step outside of your comfort zone. It encourages you to be open to new opportunities and to follow your curiosity. This hexagram represents a journey or a time of moving from one place to another. It advises being resourceful and flexible while navigating unfamiliar territory.`,  
        above: bagua.bagua.zhèn,
        below: bagua.bagua.gèn,
        explanation: `Lǚ represents the journey and the experiences gained through exploration and movement. It emphasizes adaptability and the importance of learning from diverse encounters.`,
        judgement: `The wanderer signifies a time of travel and transition, urging one to embrace new experiences. Through exploration, valuable insights and growth can be achieved.`,
        image: `The image of Lǚ is a traveler on a journey, symbolizing the lessons learned through wandering. The wise person remains open and curious, finding meaning in their experiences.`,
        lines: `- **Line 1:** Initial journeys may be challenging; persevere.  
        - **Line 2:** Seek guidance from those who have traveled before.  
        - **Line 3:** Maintain flexibility in plans to adapt to changing circumstances.  
        - **Line 4:** Nurture connections made along the way; they may prove beneficial.  
        - **Line 5:** Acknowledge that each step is a learning experience.  
        - **Line 6:** Beware of aimlessness; have a purpose in your travels.`
    },
    xián: {
        name: 'xián, hsien',
        symbol: '咸', 
        hexagram: '䷞',
        binary: '011100',
        order: 14, 
        kingwen:31,     
        translation: 'Influence (Wooing)',     
        summary: `This hexagram symbolizes the power of attraction and influence. It advises you to be mindful of the impact you have on others and to use your influence wisely. It encourages you to build strong connections and to foster harmonious relationships. This hexagram signifies the power of gentle persuasion and emotional connection. It advises creating harmony through empathy and understanding.`,
        above: bagua.bagua.duì,
        below: bagua.bagua.gèn,
        explanation: `Xián symbolizes mutual attraction and influence, emphasizing the power of relationships and connections. It highlights how sensitivity and receptivity to others create harmony and unity.`,
        judgement: `Influence through sensitivity and mutual respect leads to success. By recognizing the subtle forces at play in relationships, one can foster deeper connections and shared understanding.`,
        image: `The image of Xián is the lake at the foot of the mountain, representing attraction. The wise person opens their heart to the influence of others, allowing for meaningful interactions.`,
        lines: `- **Line 1:** Genuine attraction begins with openness.  
        - **Line 2:** Mutual respect strengthens connections.  
        - **Line 3:** Emotional impulses should be balanced with reason.  
        - **Line 4:** Careful communication builds lasting influence.  
        - **Line 5:** Harmony arises from shared values and goals.  
        - **Line 6:** Lasting influence requires depth and sincerity.`
    },
    dùn: {
        name: 'dùn, tun',
        symbol: '遯', 
        hexagram: '䷠',
        binary: '111100',
        order: 15,
        kingwen:33,    
        translation: 'Retreat',     
        summary: `This hexagram symbolizes the power of retreat and withdrawal. It advises you to take a step back and to create space for reflection and introspection. It encourages you to listen to your inner voice and to trust your intuition. This hexagram suggests pulling back from a situation that is not advantageous. It advises regrouping and waiting for a better opportunity.`,   
        above: bagua.bagua.qián,
        below: bagua.bagua.gèn,
        explanation: `Dùn signifies strategic retreat and withdrawal from unfavorable situations. It advises knowing when to step back to avoid unnecessary conflict.`,
        judgement: `Retreat at the right time leads to safety and growth. By recognizing when to withdraw and conserve energy, one can prepare for a more favorable opportunity.`,
        image: `The image of Dùn is the mountain standing firm, symbolizing a wise retreat. The superior person knows that patience and tact are sometimes more powerful than confrontation.`,
        lines: `- **Line 1:** Retreat in time to avoid unnecessary strife.  
        - **Line 2:** Preserve your integrity even while stepping back.  
        - **Line 3:** Don't let pride prevent a wise retreat.  
        - **Line 4:** Strategic withdrawal sets the stage for future success.  
        - **Line 5:** Firmness in retreat earns respect and security.  
        - **Line 6:** Complete withdrawal brings clarity and peace.`
    },
    shī: {
        name: 'shī, shih',
        symbol: '師', 
        hexagram: '䷆',   
        binary: '000010',     
        order: 16, 
        kingwen:7,  
        translation: 'The Army',    
        summary: `This hexagram symbolizes the power of leadership and strategy. It advises you to take charge and to lead with confidence. It encourages you to be decisive and to trust your instincts. This hexagram emphasizes the importance of strategic planning and strong leadership to achieve collective goals. It advises acting with unity and purpose.`,     
        above: bagua.bagua.kūn,
        below: bagua.bagua.kǎn,
        explanation: `Shī represents organized effort and discipline, often symbolized by an army. It emphasizes the need for strategic leadership and collective action.`,
        judgement: `The Army must be led with discipline and integrity. Victory is achieved through strategic planning and the united efforts of all involved.`,
        image: `The image of Shī is water beneath the earth, suggesting hidden strength. The wise person builds a strong foundation and leads with purpose.`,
        lines: `- **Line 1:** Gather your forces; a strong beginning is key.  
        - **Line 2:** A disciplined approach ensures success in action.  
        - **Line 3:** Leaders must earn the respect of their followers.  
        - **Line 4:** Wise counsel leads to victory in difficult battles.  
        - **Line 5:** A strong leader maintains order and direction.  
        - **Line 6:** Avoid unnecessary confrontations; focus on harmony.`
    },
    méng: {
        name: 'méng,mèng',
        symbol: '蒙', 
        hexagram: '䷃',
        binary: '100010',
        order: 17,    
        kingwen:4,   
        translation: 'Youthful Folly',     
        summary: `This hexagram symbolizes the power of innocence and curiosity. It advises you to embrace your inner child and to approach life with a sense of wonder and playfulness. It encourages you to be open to new experiences and to learn from your mistakes. This hexagram indicates a lack of experience and the importance of seeking knowledge. It advises humility and openness to instruction while avoiding impulsive behavior.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.kǎn,
        explanation: `Mèng represents the uncertainty and naivety of youth. It advises learning and self-improvement through discipline and guidance.`,
        judgement: `Youthful folly must be corrected through discipline and openness to learning. Guidance and patience lead to proper growth.`,
        image: `The image of Mèng is a spring gushing forth from the mountain, symbolizing youthful energy. The wise person seeks knowledge and understanding.`,
        lines: `- **Line 1:** Ignorance can be corrected with effort.  
        - **Line 2:** Good fortune comes from seeking guidance.  
        - **Line 3:** Unwillingness to learn leads to repeated mistakes.  
        - **Line 4:** Honest mistakes are forgivable; seek wisdom.  
        - **Line 5:** Gentle correction fosters growth and respect.  
        - **Line 6:** Obstinate behavior hinders progress; change is needed.`
    },
    kǎn: {
        name: `kǎn, k'an`,
        symbol: '坎', 
        hexagram: '䷜',
        binary: '010010',
        order: 18,
        kingwen:29,   
        translation: 'The Abysmal (Water)',         
        summary: `This hexagram symbolizes the power of the unknown and the unconscious. It advises you to trust your intuition and to explore your emotions. It encourages you to dive deep into your subconscious and to uncover hidden truths. This hexagram represents difficult circumstances that require courage and resilience to navigate. It advises steady progress despite obstacles.`,
        above: bagua.bagua.kǎn,
        below: bagua.bagua.kǎn,
        explanation: `Kǎn represents the concept of danger and repeated obstacles, like water in a ravine. It signifies a need for perseverance and caution when faced with difficulties.`,
        judgement: `The abysmal calls for resilience and steadfastness. By navigating challenges with careful determination, one can overcome even the most daunting obstacles.`,
        image: `The image of Kǎn is water flowing continuously, symbolizing the persistence needed to move through hardships. The wise person faces danger with courage and clarity.`,
        lines: `- **Line 1:** Fall into the abyss, but hold on to hope.  
        - **Line 2:** Despite difficulties, stay true to your principles.  
        - **Line 3:** Repeated trouble tests your endurance.  
        - **Line 4:** Clarity of purpose helps you find a way out.  
        - **Line 5:** Overcome fear by remaining steady and focused.  
        - **Line 6:** Deep waters bring danger, yet calm perseverance prevails.`
    },
    huàn: {
        name: 'huàn',
        symbol: '渙', 
        hexagram: '䷺',
        binary: '110010',
        order: 19,
        kingwen:59,     
        translation: 'Dispersion (Dissolution)',       
        summary: `This hexagram symbolizes the power of release and letting go. It advises you to surrender to the flow of life and to release what no longer serves you. It encourages you to trust the process and to allow things to unfold naturally. This hexagram represents a need to break down barriers and clear confusion. It encourages dispersing negativity and bringing harmony to chaotic situations.`,
        above: bagua.bagua.xùn,
        below: bagua.bagua.kǎn,
        explanation: `Huàn symbolizes the dispersal of obstacles and the ability to navigate through challenges. It emphasizes the importance of adaptability and the need to let go of negativity to foster renewal.`,
        judgement: `Dispersion indicates the importance of breaking free from constricting influences. By embracing change and releasing burdens, new opportunities for growth and clarity emerge.`,
        image: `The image of Huàn is a cloud dissipating in the sky, representing the release of tensions and the emergence of clarity. The wise person allows for transformation through letting go.`,
        lines: `- **Line 1:** Small changes can lead to significant shifts; embrace them.  
        - **Line 2:** Release old habits that hinder your progress.  
        - **Line 3:** Foster communication to clear misunderstandings.  
        - **Line 4:** Acknowledge the need for change to achieve clarity.  
        - **Line 5:** Support from others aids in overcoming challenges.  
        - **Line 6:** Total release may lead to liberation; embrace the process.`
    },
    xiè: {
        name: `xiè, hsieh`,
        symbol: '解', 
        hexagram: '䷧',
        binary: '001010',
        order: 20, 
        kingwen:40,      
        translation: 'Deliverance',     
        summary: `This hexagram symbolizes the power of liberation and freedom. It advises you to break free from the past and to embrace new opportunities. It encourages you to let go of what is holding you back and to step into your power. This hexagram indicates a time when difficulties are resolved, and freedom from constraints is possible. It encourages letting go of burdens.`,
        above: bagua.bagua.zhèn,
        below: bagua.bagua.kǎn,
        explanation: `Jiě signifies the release from tension and the resolution of problems. It represents a turning point where difficulties ease and a sense of freedom is restored.`,
        judgement: `Deliverance brings relief and clarity. With the resolution of past issues, it's time to move forward with renewed energy and focus on new possibilities.`,
        image: `The image of Jiě is thunder and rain clearing the sky, symbolizing the dispelling of difficulties. The wise person takes decisive action to resolve problems and create new opportunities.`,
        lines: `- **Line 1:** Immediate action brings quick relief.  
        - **Line 2:** A calm approach leads to smooth resolutions.  
        - **Line 3:** Past mistakes are corrected with patience.  
        - **Line 4:** Recognize the opportunity to break free from the past.  
        - **Line 5:** Deliverance comes with forgiveness and understanding.  
        - **Line 6:** Freedom is fully realized when all burdens are released.`
    },
    wèijì: {
        name: `wèi jì, wei chi`,
        symbol: '未濟', 
        hexagram: '䷿',
        binary: '101010',
        order: 21,
        kingwen:64,    
        translation: 'Before Completion',      
        summary: `This hexagram symbolizes the power of unfinished business and incomplete projects. It advises you to tie up loose ends and to complete what you have started. It encourages you to stay focused and to follow through on your commitments. This hexagram represents the final stages of a journey where success is close but not yet achieved. It encourages patience, focus, and careful actions to reach your goal.`,  
        above: bagua.bagua.lí,
        below: bagua.bagua.kǎn,
        explanation: `Wèi Jì represents the phase just before completion, highlighting the importance of preparation and the need for caution in the final stages of a project or endeavor.`,
        judgement: `Before completion urges vigilance and careful planning. By recognizing the remaining challenges and taking appropriate steps, one can ensure a successful outcome.`,
        image: `The image of Wèi Jì is a process that is nearly finished, symbolizing the need for final adjustments and awareness. The wise person prepares meticulously to avoid setbacks in the last moments.`,
        lines: `- **Line 1:** Small adjustments can lead to a successful finish; attend to them.  
        - **Line 2:** Beware of overconfidence; stay alert to the details.  
        - **Line 3:** Collaborate with others to ensure all perspectives are considered.  
        - **Line 4:** Trust in your preparations; they will support your success.  
        - **Line 5:** Stay focused; the end is within reach, but caution is essential.  
        - **Line 6:** Avoid rushing; patience will lead to a more complete success.`
    },
    kùn: {
        name: `kùn, k'un`,
        symbol: '困', 
        hexagram: '䷮',
        binary: '011010',
        order: 22,  
        kingwen:47,       
        translation: 'Oppression (Exhaustion)',   
        summary: `This hexagram symbolizes the power of oppression and exhaustion. It advises you to take a break and to rest and recharge. It encourages you to listen to your body and to take care of yourself. This hexagram indicates a situation of pressure, limitation, or constraint. It advises enduring hardships with resilience and looking for ways to adapt to challenging conditions.`,
        above: bagua.bagua.duì,
        below: bagua.bagua.kǎn,
        explanation: `Kùn symbolizes a state of oppression or constraint. It reflects situations where one feels trapped or burdened, urging careful navigation through difficulties while maintaining inner strength.`,
        judgement: `Oppression indicates a challenging period that requires resilience and patience. While external pressures may feel overwhelming, maintaining a calm and steady approach is essential for eventual relief.`,
        image: `The image of Kùn is a marshy ground, suggesting feelings of being stuck. The wise person remains grounded, finding ways to cultivate strength from within during tough times.`,
        lines: `- **Line 1:** Even in difficult times, small steps can lead to liberation.  
        - **Line 2:** Seek support from others to alleviate burdens.  
        - **Line 3:** Acknowledging challenges is the first step toward overcoming them.  
        - **Line 4:** Create boundaries to maintain your well-being.  
        - **Line 5:** Inner strength allows you to withstand oppression.  
        - **Line 6:** Do not succumb to despair; change is possible.`
    },
    sòng: {
        name: 'sòng, sung',
        symbol: '訟', 
        hexagram: '䷅',
        binary: '111010',
        order: 23, 
        kingwen:6,   
        translation: 'Conflict',     
        summary: `This hexagram symbolizes the power of conflict and disagreement. It advises you to address the issues at hand and to find a resolution. It encourages you to communicate openly and honestly with others. This hexagram points to disputes and the necessity of resolving conflicts with wisdom and diplomacy. It's a reminder to stay calm and avoid aggressive actions.`,    
        above: bagua.bagua.qián,
        below: bagua.bagua.kǎn,
        explanation: `Sòng signifies a time of conflict or disagreement. It advises careful consideration before engaging in disputes and finding a resolution that avoids unnecessary strife.`,
        judgement: `Conflict leads to obstacles and challenges. It is wise to seek a resolution through mediation rather than force, and to proceed with caution.`,
        image: `The image of Sòng is water flowing against heaven, symbolizing resistance. The wise person seeks to resolve conflict with reason and fairness.`,
        lines: `- **Line 1:** Avoid confrontation by stepping back from the dispute.  
        - **Line 2:** A firm but fair approach helps to settle disagreements.  
        - **Line 3:** Misunderstandings deepen conflict; seek clarity.  
        - **Line 4:** Resolve issues through compromise and goodwill.  
        - **Line 5:** Justice prevails when truth guides the way.  
        - **Line 6:** A hasty confrontation leads to regret; avoid rash actions.`
    },
    shēng: {
        name: 'shēng',
        symbol: '升', 
        hexagram: '䷭',
        binary: '000110',
        order: 24,  
        kingwen:46,  
        translation: 'Pushing Upward',   
        summary: `This hexagram symbolizes the power of growth and expansion. It advises you to reach for the stars and to pursue your dreams with passion and determination. It encourages you to step out of your comfort zone and to embrace new opportunities. This hexagram represents a gradual rise toward a higher position or goal. It encourages persistence, humility, and a step-by-step approach to achieve progress.`,     
        above: bagua.bagua.kūn,
        below: bagua.bagua.xùn,
        explanation: `Shēng symbolizes progress and growth through consistent effort and determination. It advises steady, upward movement toward one's goals without rushing or force.`,
        judgement: `Pushing upward leads to gradual yet steady progress. By remaining patient and committed to the path ahead, success and growth are assured.`,
        image: `The image of Shēng is wood growing within the earth, symbolizing natural progress. The wise person supports growth by nurturing their efforts with care and dedication.`,
        lines: `- **Line 1:** Begin your ascent with a strong foundation.  
        - **Line 2:** Step by step, make sure your progress is steady.  
        - **Line 3:** Seek guidance from those who have gone before you.  
        - **Line 4:** Hard work at this stage leads to visible progress.  
        - **Line 5:** Trust in the process of growth and move confidently.  
        - **Line 6:** Achieve success through consistent effort and sincerity.`
    },
    gǔ: {
        name: 'gǔ, ku',
        symbol: '蠱', 
        hexagram: '䷑',
        binary: '100110',
        order: 25, 
        kingwen:18,   
        translation: 'Work on What Has Been Spoiled (Decay)',        
        summary: `This hexagram symbolizes the power of transformation and renewal. It advises you to let go of what no longer serves you and to make space for new growth and opportunities. It encourages you to embrace change and to trust the process. This hexagram encourages taking responsibility to address problems, clean up past errors, and restore order through diligence.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.xùn,
        explanation: `Gù highlights the need to address past mistakes and correct what has been damaged. It signifies a time of renewal through diligent effort and honesty.`,
        judgement: `Working on what has been spoiled requires patience and commitment. Only by confronting issues directly can one restore balance and harmony.`,
        image: `The image of Gù is the wind blowing over the mountain, symbolizing gradual repair. The wise person works steadily to correct past errors.`,
        lines: `- **Line 1:** Address issues early to prevent greater damage.  
        - **Line 2:** Correction must be guided by truth and fairness.  
        - **Line 3:** Ignoring problems leads to further decay.  
        - **Line 4:** With determination, restoration becomes possible.  
        - **Line 5:** Corrective action brings success and renewal.  
        - **Line 6:** Avoid punishing yourself for past mistakes; learn and grow.`
    },
    jǐng: {
        name: `jǐng, ching`,
        symbol: '井', 
        hexagram: '䷯',
        binary: '010110',
        order: 26, 
        kingwen:48,      
        translation: 'Ching / The Well',     
        summary: `This hexagram symbolizes the power of nourishment and sustenance. It advises you to take care of yourself and to nurture your body, mind, and spirit. It encourages you to prioritize your well-being and to make self-care a priority. This hexagram symbolizes a source of sustenance that remains constant. It suggests drawing from your inner resources or wisdom to nourish yourself and others.`,
        above: bagua.bagua.kǎn,
        below: bagua.bagua.xùn,
        explanation: `Jǐng represents nourishment, resourcefulness, and the idea of tapping into one's inner well of potential. It emphasizes the importance of sustaining oneself and others through shared resources.`,
        judgement: `The well signifies the source of sustenance and wisdom. By returning to foundational principles and nurturing connections, one can draw from a deep reservoir of support and vitality.`,
        image: `The image of Jǐng is a deep well, representing a source of life and renewal. The wise person knows when to draw from their resources to nourish growth and well-being.`,
        lines: `- **Line 1:** Stay close to your source of nourishment.  
        - **Line 2:** Avoid overextending yourself; balance is key.  
        - **Line 3:** Acknowledge the value of tradition and experience.  
        - **Line 4:** Provide for others, but do not neglect your own needs.  
        - **Line 5:** Wisdom comes from understanding your own resources.  
        - **Line 6:** Ensure the well remains pure; avoid contamination.`
    },
    xùn: {
        name: 'xùn',
        symbol: '巽', 
        hexagram: '䷸',
        binary: '110110',
        order: 27,    
        kingwen:57,     
        translation: 'The Gentle (Penetrating, Wind)',   
        summary: `This hexagram symbolizes the power of flexibility and adaptability. It advises you to go with the flow and to embrace change with an open mind. It encourages you to be open to new ideas and to be willing to try new things. This hexagram emphasizes the power of gentleness and consistent effort to bring about change. It suggests persistence in a calm and steady manner.`,
        above: bagua.bagua.xùn,
        below: bagua.bagua.xùn,
        explanation: `Xùn symbolizes gentleness, penetration, and the power of subtle influence. It emphasizes the importance of soft strength and the ability to effect change through patience and diplomacy.`,
        judgement: `The gentle suggests that persistence and quiet influence can lead to profound change. By adopting a gentle approach, one can navigate challenges and foster positive relationships.`,
        image: `The image of Xùn is wind, representing gentle movement and the capacity to reach places that force cannot. The wise person understands the value of subtlety in their actions.`,
        lines: `- **Line 1:** Gentle beginnings can lead to significant developments.  
        - **Line 2:** Cultivate relationships through kindness and understanding.  
        - **Line 3:** Too much force can backfire; practice restraint.  
        - **Line 4:** Offer support to others with empathy and care.  
        - **Line 5:** The strength of gentleness can inspire loyalty and trust.  
        - **Line 6:** Avoid harshness; it can destroy the bonds you've built.`
    },
    héng: {
        name: 'héng',
        symbol: '恆', 
        hexagram: '䷟',
        binary: '001110',
        order: 28, 
        kingwen:32,      
        translation: 'Duration',     
        summary: `This hexagram symbolizes the power of endurance and perseverance. It advises you to stay the course and to keep moving forward, even in the face of challenges. It encourages you to trust the process and to stay focused on your goals. This hexagram encourages perseverance in pursuing long-term goals and maintaining a steady course, regardless of external changes.`,
        above: bagua.bagua.zhèn,
        below: bagua.bagua.xùn,
        explanation: `Héng represents endurance and consistency. It teaches the value of sustained effort and stability, encouraging long-term commitment and reliability.`,
        judgement: `Duration leads to success through persistence and steadfastness. By maintaining focus and not wavering in one's purpose, one achieves lasting results.`,
        image: `The image of Héng is thunder and wind moving together, symbolizing continuous growth. The wise person stays true to their course, ensuring long-term success.`,
        lines: `- **Line 1:** Consistency in small things leads to big changes.  
        - **Line 2:** Avoid overcommitting to uncertain paths.  
        - **Line 3:** Commitment must be rooted in true belief.  
        - **Line 4:** Longevity in action brings reliable outcomes.  
        - **Line 5:** Unwavering dedication is rewarded.  
        - **Line 6:** Stubborn persistence without flexibility can lead to failure.`
    },
    dǐng: {
        name: 'dǐng, ting ',
        symbol: '鼎', 
        hexagram: '䷱',
        binary: '101110',
        order: 29, 
        kingwen:50,    
        translation: 'The Cauldron',  
        summary: `This hexagram symbolizes the power of transformation and change. It advises you to embrace new opportunities and to let go of what no longer serves you. It encourages you to trust the process and to be open to new possibilities. This hexagram represents the vessel in which transformation occurs. It highlights the importance of cultivating talents and nurturing what brings value to your life.`,     
        above: bagua.bagua.lí,
        below: bagua.bagua.xùn,
        explanation: `Dīng represents nourishment, transformation, and the alchemy of creating value from resources. It emphasizes the importance of cultivating potential and fostering growth through careful management.`,
        judgement: `The cauldron symbolizes the art of transformation and preparation. By focusing on nourishment and refinement, one can create a prosperous outcome from the resources at hand.`,
        image: `The image of Dīng is a cooking vessel over fire, signifying the process of creating something valuable. The wise person knows how to mix and harmonize various elements to foster growth and development.`,
        lines: `- **Line 1:** Initiate the process of transformation with dedication.  
        - **Line 2:** Ensure the ingredients are of high quality for best results.  
        - **Line 3:** Collaboration enhances the process of creation.  
        - **Line 4:** Take time to refine and perfect your craft.  
        - **Line 5:** Wise leadership brings harmony and success to the team.  
        - **Line 6:** Completion requires attention to detail; don't rush.`
    },
    dàguò: {
        name: 'dà guò, ta kuo',
        symbol: '大過', 
        hexagram: '䷛',
        binary: '011110',
        order: 30, 
        kingwen:28,    
        translation: 'Preponderance of the Great',    
        summary: `This hexagram symbolizes the power of excess and overindulgence. It advises you to be mindful of your actions and to avoid going to extremes. It encourages you to find balance in all areas of your life and to practice moderation. This hexagram signifies a situation that is at the breaking point and requires immediate action. It advises making necessary changes before things collapse.`,   
        above: bagua.bagua.duì,
        below: bagua.bagua.xùn,
        explanation: `Dà Guò indicates a time when the weight of the situation is extreme, requiring special care and attention. It suggests going beyond the usual limits.`,
        judgement: `Preponderance of the great calls for decisive action. One must remain strong under pressure and handle excess with skill and caution.`,
        image: `The image of Dà Guò is the lake rising above the trees, symbolizing a situation that is out of balance. The wise person handles excess with poise and strategic thinking.`,
        lines: `- **Line 1:** Caution at the outset prevents later issues.  
        - **Line 2:** Steadfastness helps in managing challenges.  
        - **Line 3:** Act decisively to support those around you.  
        - **Line 4:** Staying flexible prevents strain under pressure.  
        - **Line 5:** True leadership emerges in times of crisis.  
        - **Line 6:** Recognize the limits of what you can control.`
    },
    gòu: {
        name: 'gòu, kou',
        symbol: '姤', 
        hexagram: '䷫',
        binary: '111110',
        order: 31,
        kingwen:44,     
        translation: 'Coming to Meet',     
        summary: `This hexagram symbolizes the power of connection and communication. It advises you to reach out to others and to build strong relationships. It encourages you to be open to new opportunities and to embrace the power of collaboration. This hexagram represents a time of meeting and connecting with others. It advises building relationships through open communication and mutual respect. This hexagram signifies the arrival of powerful influences that can be either positive or negative. It warns of the potential for distraction or misleading enticements. It advises being aware of what is approaching and maintaining clarity and control, staying true to your principles to avoid being led astray.`,
        above: bagua.bagua.qián,
        below: bagua.bagua.xùn,
        explanation: `Gòu represents a meeting or encounter that may seem insignificant at first but can have significant consequences. It advises caution in approaching such situations with wisdom and awareness.`,
        judgement: `Coming to meet requires caution. Small influences can grow into larger consequences if not handled properly. Approach new encounters with clear intent and careful observation.`,
        image: `The image of Gòu is the wind under heaven, symbolizing subtle influences rising to prominence. The wise person recognizes small beginnings and manages them with prudence.`,
        lines: `- **Line 1:** Be alert to minor issues that may grow into larger problems.  
        - **Line 2:** Do not underestimate the power of small influences.  
        - **Line 3:** Remain vigilant against hidden dangers.  
        - **Line 4:** Accept only what is beneficial and aligned with your goals.  
        - **Line 5:** Meeting others halfway ensures mutual benefit.  
        - **Line 6:** Too much compromise weakens your position.`
    },
    fù: {
        name: 'fù',
        symbol: '復', 
        hexagram: '䷗',
        binary: '000001',
        order: 32,  
        kingwen:24, 
        translation: 'Return (The Turning Point)',    
        summary: `This hexagram symbolizes the power of transformation and change. It advises you to let go of the past and to embrace new opportunities. It encourages you to trust the process and to be open to new possibilities. This hexagram represents a turning point where things begin to improve. It encourages returning to your true path with renewed energy and focus.`,          
        above: bagua.bagua.kūn,
        below: bagua.bagua.zhèn,
        explanation: `Fù signifies the return of energy and the cycle of renewal. It marks the beginning of a new phase, encouraging hope and new possibilities.`,
        judgement: `Return brings renewal and a fresh start. By returning to one's true path with sincerity, one finds growth, success, and positive change.`,
        image: `The image of Fù is thunder emerging from the earth, representing resurgence. The wise person embraces new opportunities with a sense of purpose and readiness.`,
        lines: `- **Line 1:** The first step in returning is often the hardest.  
        - **Line 2:** Small, consistent efforts lead to lasting change.  
        - **Line 3:** Be wary of losing direction in your journey.  
        - **Line 4:** Return with patience and the results will follow.  
        - **Line 5:** Renewed efforts bring clear success.  
        - **Line 6:** Reflect on past mistakes to avoid repeating them.`
    },
    yí: {
        name: `yí, I`,
        symbol: '頤', 
        hexagram: '䷚',
        binary: '100001',
        order: 33,   
        kingwen:27,   
        translation: 'Corners of the Mouth (Nourishment)',   
        summary: `This hexagram symbolizes the power of nourishment and self-care. It advises you to take care of yourself and to prioritize your well-being. It encourages you to nourish your body, mind, and spirit and to make self-care a priority. This hexagram focuses on the importance of nurturing oneself and others, both physically and spiritually, through balanced and mindful practices.`,     
        above: bagua.bagua.gèn,
        below: bagua.bagua.zhèn,
        explanation: `Yí focuses on nourishment, both physical and spiritual. It emphasizes the importance of what we consume—our food, thoughts, and influences.`,
        judgement: `Nourishment brings success when one chooses wisely. By nurturing oneself with positive thoughts and actions, one can support growth and well-being.`,
        image: `The image of Yí is thunder below the mountain, symbolizing the energy of nourishment. The wise person feeds both body and mind with care and attention.`,
        lines: `- **Line 1:** Begin with small steps to nourish your potential.  
        - **Line 2:** Focus on what truly sustains you.  
        - **Line 3:** Avoid being consumed by trivial desires.  
        - **Line 4:** Proper nourishment builds strength over time.  
        - **Line 5:** Provide support to those in need of guidance.  
        - **Line 6:** Overindulgence leads to stagnation; seek balance.`
    },
    zhūn: {
        name: 'zhūn, chun',
        symbol: '屯', 
        hexagram: '䷂',
        binary: '010001',
        order: 34,   
        kingwen:3,  
        translation: 'Difficulty at the Beginning',   
        summary: `This hexagram symbolizes the power of challenges and obstacles. It advises you to stay the course and to keep moving forward, even in the face of difficulties. It encourages you to trust the process and to be patient with yourself.
        This hexagram represents a period of struggle where obstacles appear daunting, but perseverance and careful planning can lead to growth and eventual success.`,      
        above: bagua.bagua.kǎn,
        below: bagua.bagua.zhèn,
        explanation: `Zhūn symbolizes the challenges faced when starting a new venture. It emphasizes the need for patience, persistence, and strategic action.`,
        judgement: `Difficulty at the beginning. Success lies in persevering through obstacles with focus and determination, leading to ultimate growth.`,
        image: `The image of Zhūn is water rising above the sky, reflecting the turbulence of starting anew. The wise person overcomes by remaining steadfast and adaptable.`,
        lines: `- **Line 1:** Cautious steps prevent setbacks in early stages.  
        - **Line 2:** Hidden allies may help overcome difficulties.  
        - **Line 3:** Obstacles can be overwhelming; do not proceed blindly.  
        - **Line 4:** Balance effort with rest to avoid exhaustion.  
        - **Line 5:** Efforts gradually yield progress; remain hopeful.  
        - **Line 6:** Exhaustion is near; take time to regain strength.`
    },
    yì: {
        name: `yì, I`,
        symbol: '益', 
        hexagram: '䷩',
        binary: '110001',
        order: 35,   
        kingwen:42,    
        translation: 'Increase',  
        summary: `This hexagram symbolizes the power of growth and expansion. It advises you to embrace new opportunities and to pursue your goals with passion and determination. It encourages you to take action and to keep pushing yourself. This hexagram represents a time of abundance and expansion. It advises sharing your good fortune and supporting others to create positive momentum.`,     
        above: bagua.bagua.xùn,
        below: bagua.bagua.zhèn,
        explanation: `Yì represents growth, abundance, and the idea of increasing what is beneficial. It encourages generosity, collaboration, and the wise use of resources.`,
        judgement: `Increase comes through shared effort and generosity. By giving freely and supporting others, one opens the door to greater abundance and mutual prosperity.`,
        image: `The image of Yì is the wind and thunder, symbolizing dynamic growth. The wise person encourages progress by fostering goodwill and cooperation.`,
        lines: `- **Line 1:** Begin with small efforts to ensure success.  
        - **Line 2:** Support from others leads to steady growth.  
        - **Line 3:** Avoid greed; share your gains for greater rewards.  
        - **Line 4:** Wise investments bring lasting benefits.  
        - **Line 5:** Generosity and kindness enhance prosperity.  
        - **Line 6:** Balance increase with careful management.`
    },
    zhèn: {
        name: 'zhèn, chen',
        symbol: '震', 
        hexagram: '䷲',
        binary: '001001',
        order: 36,   
        kingwen:51,  
        translation: 'The Arousing (Shock, Thunder)',  
        summary: `This hexagram symbolizes the power of awakening and transformation. It advises you to embrace change and to step into your power. It encourages you to trust the process and to be open to new possibilities. This hexagram signifies sudden changes or disruptions that lead to new awareness. It advises staying calm and using the energy of surprise to propel yourself forward.`,       
        above: bagua.bagua.zhèn,
        below: bagua.bagua.zhèn,
        explanation: `Zhèn symbolizes movement, excitement, and the element of surprise. It encourages embracing new energy and awakening to opportunities that can lead to significant breakthroughs.`,
        judgement: `The arousing suggests that sudden changes can lead to growth and transformation. By being open to new experiences and responding quickly to emerging situations, one can harness their potential.`,
        image: `The image of Zhèn is thunder, representing sudden and powerful movement. The wise person prepares for unexpected shifts and adapts swiftly to capitalize on new opportunities.`,
        lines: `- **Line 1:** Embrace initial sparks of energy; they can lead to greater opportunities.  
        - **Line 2:** Act decisively when unexpected changes arise.  
        - **Line 3:** Beware of becoming overwhelmed by sudden developments.  
        - **Line 4:** Find strength in your reactions to new challenges.  
        - **Line 5:** Channel your energy into constructive outlets for growth.  
        - **Line 6:** Recognize the power of transformation in moments of disruption.`
    },
    shìkè: {
        name: 'shì kè, shih ho',
        symbol: '噬嗑', 
        hexagram: '䷔',
        binary: '101001',
        order: 37,   
        kingwen:21,   
        translation: 'Biting Through',   
        summary: `This hexagram symbolizes the power of determination and perseverance. It advises you to stay focused on your goals and to push through obstacles. It encourages you to be resilient and to keep moving forward, even in the face of challenges. This hexagram suggests that problems require decisive action and a firm approach to break through resistance.`,     
        above: bagua.bagua.lí,
        below: bagua.bagua.zhèn,
        explanation: `Shì Kè represents the need for decisive action to overcome obstacles. It emphasizes the importance of clarity and directness in dealing with difficulties.`,
        judgement: `Biting through challenges brings resolution. By addressing problems directly and fairly, one clears away obstacles and finds a path to success.`,
        image: `The image of Shì Kè is thunder and lightning, symbolizing decisive energy. The wise person uses clear judgment to eliminate doubts and act with precision.`,
        lines: `- **Line 1:** Resolve small issues promptly to avoid escalation.  
        - **Line 2:** Fairness in judgment prevents misunderstanding.  
        - **Line 3:** Overcoming challenges requires careful thought.  
        - **Line 4:** Patience is needed to see justice served.  
        - **Line 5:** Swift action clears the way for future growth.  
        - **Line 6:** Avoid unnecessary severity; balance force with compassion.`
    },
    suí: {
        name: 'suí',
        symbol: '隨', 
        hexagram: '䷐',
        binary: '011001',
        order: 38,   
        kingwen:17,  
        translation: 'Following',  
        summary: `This hexagram symbolizes the power of following and surrendering. It advises you to go with the flow and to trust the process. It encourages you to be open to new opportunities and to embrace the power of surrender. This hexagram suggests being flexible and willing to follow a path that aligns with natural order or the wishes of others, leading to harmony.`,       
        above: bagua.bagua.duì,
        below: bagua.bagua.zhèn,
        explanation: `Suí signifies adaptability and the willingness to follow a path. It advises finding harmony by aligning with the natural flow of circumstances.`,
        judgement: `Following the right course brings success. By yielding to the greater forces at play, one achieves their aims with ease and grace.`,
        image: `The image of Suí is thunder in the lake, symbolizing joyful movement. The wise person adapts to changing conditions and follows the truth.`,
        lines: `- **Line 1:** Following with sincerity leads to progress.  
        - **Line 2:** Finding harmony in the details strengthens your path.  
        - **Line 3:** Confusion arises if the direction is unclear.  
        - **Line 4:** Align your intentions with your purpose to avoid doubt.  
        - **Line 5:** Following one's true nature brings fulfillment.  
        - **Line 6:** Overly rigid following leads to stagnation; stay flexible.`
    },
    wúwàng: {
        name: 'wú wàng',
        symbol: '無妄', 
        hexagram: '䷘',
        binary: '111001',
        order: 39,   
        kingwen:25,       
        translation: 'Innocence (The Unexpected)', 
        summary: `This hexagram symbolizes the power of innocence and spontaneity. It advises you to approach life with an open mind and a sense of wonder. It encourages you to be open to new experiences and to embrace the unexpected. This hexagram emphasizes acting naturally, without ulterior motives or manipulation. It advises trusting your instincts and being true to your principles.`,   
        above: bagua.bagua.qián,
        below: bagua.bagua.zhèn,
        explanation: `Wú Wàng represents innocence and sincerity, advising a pure and natural approach to life. It highlights the value of acting without hidden motives.`,
        judgement: `Innocence leads to success. By acting with a heart free from deceit and a clear conscience, one attracts favorable outcomes and avoids complications.`,
        image: `The image of Wú Wàng is thunder in the sky, symbolizing natural energy. The wise person aligns with their true nature and maintains a straightforward path.`,
        lines: `- **Line 1:** Maintain simplicity in thought and action.  
        - **Line 2:** Good fortune comes from sincerity and truthfulness.  
        - **Line 3:** Avoid forcing things; let events unfold naturally.  
        - **Line 4:** Innocence leads to unexpected gains.  
        - **Line 5:** Unwavering faith in one's integrity attracts success.  
        - **Line 6:** Loss of innocence brings misfortune; stay true.`
    },
    míngyí: {
        name: 'míng yí, ming I',
        symbol: '明夷', 
        hexagram: '䷣',
        binary: '000101',
        order: 40,   
        kingwen:36,   
        translation: 'Darkening of the Light', 
        summary: `This hexagram symbolizes the power of darkness and uncertainty. It advises you to trust the process and to be patient with yourself. It encourages you to embrace the unknown and to trust that the light will return. This hexagram signifies a time when difficulties obscure progress. It advises staying true to your principles while maintaining a low profile.`,       
        above: bagua.bagua.kūn,
        below: bagua.bagua.lí,
        explanation: `Míng Yí represents a time when clarity and truth are obscured. It advises caution, humility, and strategic retreat when faced with adverse conditions.`,
        judgement: `Darkening of the light requires patience and wisdom. By concealing one's true intentions and maintaining inner clarity, one can navigate through difficult situations.`,
        image: `The image of Míng Yí is the light that sinks below the earth, symbolizing concealment. The wise person protects their inner light while adapting to challenging circumstances.`,
        lines: `- **Line 1:** Stay true to your principles despite adversity.  
        - **Line 2:** Keep your light hidden to avoid drawing attention.  
        - **Line 3:** Be cautious of those who seek to harm you.  
        - **Line 4:** Guard your intentions and act with discretion.  
        - **Line 5:** Patience during darkness leads to a future renewal.  
        - **Line 6:** Even in adversity, maintain hope for brighter days.`
    },
    bì: {
        name: 'bì, pi',
        symbol: '賁', 
        hexagram: '䷕',
        binary: '100101',
        order: 41,   
        kingwen:22,  
        translation: 'Grace',         
        summary: `This hexagram symbolizes the power of grace and beauty. It advises you to embrace your inner beauty and to let your light shine. It encourages you to be kind to yourself and to others and to cultivate a sense of grace and elegance. This hexagram signifies elegance, grace, and the value of aesthetics. It advises paying attention to details and presenting oneself with dignity.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.lí,
        explanation: `Bì symbolizes beauty and grace, emphasizing the value of form, elegance, and order. It teaches that true grace is grounded in sincerity and integrity.`,
        judgement: `Grace brings refinement and harmony. By cultivating beauty in thoughts and actions, one can elevate their surroundings and inspire others.`,
        image: `The image of Bì is fire over the mountain, representing illumination and clarity. The wise person enhances their environment through acts of kindness and creativity.`,
        lines: `- **Line 1:** Simple grace is more powerful than superficial adornment.  
        - **Line 2:** Inner beauty reflects true character.  
        - **Line 3:** Avoid false appearances that lack substance.  
        - **Line 4:** Grace brings light to difficult situations.  
        - **Line 5:** Refined behavior earns respect and admiration.  
        - **Line 6:** Too much focus on appearance can lead to vanity.`
    },
    jìjì: {
        name: 'jì jì, chi chi',
        symbol: '既濟', 
        hexagram: '䷾',
        binary: '010101',
        order: 42,   
        kingwen:63,  
        translation: 'After Completion',         
        summary: `This hexagram symbolizes the power of completion and fulfillment. It advises you to celebrate your achievements and to take pride in your accomplishments. It encourages you to take a moment to reflect on how far you have come and to savor the moment. This hexagram signifies a time when everything is in its place, but further effort is required to maintain balance. It advises careful vigilance to ensure stability.`,
        above: bagua.bagua.kǎn,
        below: bagua.bagua.lí,
        explanation: `Jì Jìng signifies the state after completion and the importance of reflection and consolidation. It encourages evaluation of experiences to learn and prepare for future endeavors.`,
        judgement: `After completion reminds us that achieving goals requires careful review and consolidation of lessons learned. By reflecting on experiences, one can build a solid foundation for future success.`,
        image: `The image of Jì Jìng is a completed project, symbolizing the importance of closure and understanding. The wise person takes time to appreciate accomplishments before moving forward.`,
        lines: `- **Line 1:** Acknowledge the journey taken to reach completion; celebrate it.  
        - **Line 2:** Take time to reflect on lessons learned; they will guide future efforts.  
        - **Line 3:** Ensure that all loose ends are tied up to prevent future complications.  
        - **Line 4:** Share your insights with others to foster collective growth.  
        - **Line 5:** Avoid rushing into new endeavors; consolidation is key.  
        - **Line 6:** Closure is essential; ensure you have fully moved on before beginning anew.`
    },
    jiārén: {
        name: 'jiā rén, chia jen',
        symbol: '家人', 
        hexagram: '䷤',
        binary: '110101',
        order: 43,   
        kingwen:37,  
        translation: 'The Family (The Clan)',         
        summary: `This hexagram symbolizes the power of family and community. It advises you to nurture your relationships and to build strong connections with those around you. It encourages you to support and care for one another and to create a sense of belonging. This hexagram stresses the importance of maintaining proper roles and relationships to create stability.`,
        above: bagua.bagua.xùn,
        below: bagua.bagua.lí,
        explanation: `Jiā Rén focuses on the importance of family and domestic harmony. It emphasizes the values of loyalty, support, and nurturing relationships within the home.`,
        judgement: `The family prospers through mutual respect, love, and guidance. When each member fulfills their role with sincerity, harmony and stability are assured.`,
        image: `The image of Jiā Rén is the wind rising above the fire, symbolizing warmth and unity. The wise person strengthens family ties through kindness and clear communication.`,
        lines: `- **Line 1:** Lead by example within the family unit.  
        - **Line 2:** Support and care for those closest to you.  
        - **Line 3:** Misunderstandings should be addressed promptly.  
        - **Line 4:** Clear roles and responsibilities bring order.  
        - **Line 5:** Harmony at home reflects success in the wider world.  
        - **Line 6:** Balance discipline with compassion in family matters.`
    },
    fēng: {
        name: 'fēng',
        symbol: '豐', 
        hexagram: '䷶',
        binary: '001101',
        order: 44,   
        kingwen:55,  
        translation: 'Abundance',  
        summary: `This hexagram symbolizes the power of abundance and prosperity. It advises you to be grateful for what you have and to share your blessings with others. It encourages you to cultivate a sense of abundance and to trust that there is enough for everyone. This hexagram indicates a time of maximum potential and flourishing. It encourages embracing the moment and making the most of your opportunities.`,       
        above: bagua.bagua.zhèn,
        below: bagua.bagua.lí,
        explanation: `Fēng symbolizes abundance and prosperity, encouraging the recognition and appreciation of the wealth surrounding you. It emphasizes sharing and generosity as pathways to sustained growth.`,
        judgement: `Abundance signifies the culmination of efforts and the need to share blessings with others. By fostering a spirit of generosity, one can cultivate lasting relationships and continued prosperity.`,
        image: `The image of Fēng is a rich harvest, representing the fruits of labor. The wise person uses their abundance to support others and create a harmonious community.`,
        lines: `- **Line 1:** Acknowledge the small blessings; they can lead to greater abundance.  
        - **Line 2:** Sharing resources enhances relationships; be generous.  
        - **Line 3:** Beware of greed; maintain balance in your pursuits.  
        - **Line 4:** Use your wealth wisely to uplift those around you.  
        - **Line 5:** Abundance requires stewardship; ensure sustainability.  
        - **Line 6:** Overindulgence can lead to depletion; practice moderation.`
    },
    lí: {
        name: 'lí',
        symbol: '離', 
        hexagram: '䷝',
        binary: '101101',
        order: 45,   
        kingwen:30,   
        translation: 'The Clinging, Fire',        
        summary: `This hexagram symbolizes the power of passion and desire. It advises you to follow your heart and to pursue your dreams with passion and determination. It encourages you to be bold and to take risks in pursuit of your goals. This hexagram highlights the importance of illuminating one's path and seeking clarity in thoughts and actions. It represents reliance on principles or support.`,
        above: bagua.bagua.lí,
        below: bagua.bagua.lí,
        explanation: `Lí represents brightness and clarity, symbolized by fire. It signifies the importance of illumination, both literally and figuratively, and of finding guidance in difficult times.`,
        judgement: `The clinging fire brings clarity and enlightenment. By adhering to truth and inner light, one can navigate darkness and find inspiration.`,
        image: `The image of Lí is the fire within, symbolizing clarity of thought and focus. The wise person illuminates their path with knowledge and insight.`,
        lines: `- **Line 1:** The light of awareness begins to grow.  
        - **Line 2:** Trust in your vision; it will guide you forward.  
        - **Line 3:** Flickering light indicates uncertainty; seek stability.  
        - **Line 4:** Bright light reveals hidden truths.  
        - **Line 5:** Embrace clarity; it leads to success and harmony.  
        - **Line 6:** Excessive brilliance can blind; find a balance.`
    },
    gé: {
        name: 'gé, ko',
        symbol: '革', 
        hexagram: '䷰',
        binary: '011101',
        order: 46,   
        kingwen:49,    
        translation: 'Revolution (Molting)',      
        summary: `This hexagram symbolizes the power of transformation and change. It advises you to let go of what no longer serves you and to embrace new opportunities. It encourages you to trust the process and to be open to new possibilities.`, 
        above: bagua.bagua.duì,
        below: bagua.bagua.lí,
        explanation: `Gé symbolizes radical change, revolution, and the transformation of the status quo. It encourages a re-evaluation of existing conditions and the courage to initiate significant shifts.`,
        judgement: `Revolution is about bringing necessary change, often requiring bold decisions. By aligning your actions with a vision of a better future, you can inspire others to join in the transformation.`,
        image: `The image of Gé is the fire spreading through the woods, symbolizing a forceful shift. The wise person leads the way through revolutionary changes, inspiring collective action toward a new direction.`,
        lines: `- **Line 1:** Initiate small changes to lay the groundwork for larger transformations.  
        - **Line 2:** Be prepared for resistance but remain steadfast in your vision.  
        - **Line 3:** Avoid destructive behavior; revolution should be constructive.  
        - **Line 4:** Embrace innovation to facilitate change.  
        - **Line 5:** Powerful leaders can inspire movements; be that leader.  
        - **Line 6:** A revolution can bring chaos; navigate with wisdom.`
    },
    tóngrén: {
        name: `tóng rén, t'ung jen`,
        symbol: '同人', 
        hexagram: '䷌',
        binary: '111101',
        order: 47,   
        kingwen:13,  
        translation: 'Fellowship with Men',   
        summary: `This hexagram symbolizes the power of connection and community. It advises you to work together with others and to build strong relationships. It encourages you to support and care for one another and to create a sense of belonging. This hexagram emphasizes the importance of collaboration and aligning with like-minded people to achieve common goals.`,      
        above: bagua.bagua.qián,
        below: bagua.bagua.lí,
        explanation: `Tóng Rén signifies unity and cooperation among people. It emphasizes the strength found in shared goals and mutual support.`,
        judgement: `Fellowship with others leads to great success. By fostering open communication and aligning with like-minded individuals, one can achieve lasting harmony.`,
        image: `The image of Tóng Rén is fire rising up to heaven, representing the warmth of human connection. The wise person builds alliances and cultivates trust.`,
        lines: `- **Line 1:** True fellowship begins with sincerity and openness.  
        - **Line 2:** Loyalty strengthens connections and resolves conflicts.  
        - **Line 3:** Disagreements must be resolved to maintain unity.  
        - **Line 4:** Shared values bring success in common pursuits.  
        - **Line 5:** Harmonious leadership unites people in purpose.  
        - **Line 6:** Overcoming division restores unity and harmony.`
    },
    lín: {
        name: 'lín, lin',
        symbol: '臨', 
        hexagram: '䷒',
        binary: '000011',
        order: 48,   
        kingwen:19,   
        translation: 'Approach', 
        summary: `This hexagram symbolizes the power of preparation and planning. It advises you to take a step back and to consider your options before making a decision. It encourages you to approach the situation with an open mind and to be prepared for what lies ahead. This hexagram indicates a time when growth is possible, and careful planning can lead to success. It advises approaching goals with patience and optimism.`,       
        above: bagua.bagua.kūn,
        below: bagua.bagua.duì,
        explanation: `Lín represents progress and the approach of favorable conditions. It indicates a time to take initiative and engage with new opportunities.`,
        judgement: `Approach brings success through readiness and willingness to act. As opportunities draw near, preparation and positive action lead to achievement.`,
        image: `The image of Lín is the earth above the lake, symbolizing readiness. The wise person prepares diligently and engages with the world openly.`,
        lines: `- **Line 1:** Begin the approach with careful planning.  
        - **Line 2:** Step forward confidently, and success will follow.  
        - **Line 3:** Missteps are possible; maintain caution.  
        - **Line 4:** Proper timing ensures smooth progress.  
        - **Line 5:** Leaders inspire others through their approach.  
        - **Line 6:** Reflect on your journey as you reach the peak of success.`
    },
    sǔn: {
        name: 'sǔn, sun',
        symbol: '損', 
        hexagram: '䷨',
        binary: '100011',
        order: 49,   
        kingwen:41,  
        translation: 'Decrease',         
        summary: `This hexagram symbolizes the power of loss and sacrifice. It advises you to let go of what no longer serves you and to make space for new growth and opportunities. It encourages you to release old patterns and beliefs that are holding you back. This hexagram advises minimizing excess and focusing on essentials. It suggests that less can lead to more growth in the long term.`,
        above: bagua.bagua.gèn,
        below: bagua.bagua.duì,
        explanation: `Sǔn signifies a time of reduction or sacrifice, encouraging restraint and the reallocation of resources. It teaches that less can often lead to more in the long run.`,
        judgement: `Decrease leads to gain through moderation and wise choices. By willingly letting go of excess, one can focus on what truly matters and achieve greater balance.`,
        image: `The image of Sǔn is the mountain below the lake, symbolizing quiet strength. The wise person practices self-discipline, knowing that true wealth lies in simplicity.`,
        lines: `- **Line 1:** Simple actions lead to significant results.  
        - **Line 2:** Decrease in one area brings benefit to another.  
        - **Line 3:** Overcome difficulties by letting go of non-essentials.  
        - **Line 4:** Generosity during decrease fosters support.  
        - **Line 5:** Willingly share what you have for the greater good.  
        - **Line 6:** Excessive reduction leads to loss; find balance.`
    },
    jié: {
        name: 'jié, Chieh',
        symbol: '節', 
        hexagram: '䷻',
        binary: '010011',
        order: 50,   
        kingwen:60,        
        translation: 'Limitation',   
        summary: `This hexagram symbolizes the power of boundaries and limitations. It advises you to set clear boundaries and to honor your own needs and desires. It encourages you to take care of yourself and to prioritize your well-being. This hexagram highlights the importance of setting limits and creating order. It advises using restraint to focus energy and achieve balance.`,
        above: bagua.bagua.kǎn,
        below: bagua.bagua.duì,
        explanation: `Jié represents limitations and the importance of setting boundaries. It emphasizes that restrictions can lead to growth and understanding when approached with mindfulness.`,
        judgement: `Limitation signifies the need to define personal boundaries for better focus and clarity. By understanding and accepting limitations, one can foster growth within defined parameters.`,
        image: `The image of Jié is a river confined by banks, symbolizing structure and guidance. The wise person navigates within limits to achieve meaningful outcomes.`,
        lines: `- **Line 1:** Embrace limitations as a means to focus your efforts.  
        - **Line 2:** Setting clear boundaries enhances productivity.  
        - **Line 3:** Overstepping limits can lead to complications.  
        - **Line 4:** Respect others' boundaries to foster healthy relationships.  
        - **Line 5:** Wise use of limitations can lead to growth and understanding.  
        - **Line 6:** Acknowledging your limits can lead to greater success.`
    },
    zhōngfú: {
        name: 'zhōng fú, chung fu',
        symbol: '中孚', 
        hexagram: '䷼',
        binary: '110011',
        order: 51,   
        kingwen:61,
        translation: 'Inner Truth',           
        summary: `This hexagram symbolizes the power of inner truth and authenticity. It advises you to listen to your inner voice and to trust your intuition. It encourages you to be true to yourself and to follow your heart. This hexagram emphasizes the power of honesty and integrity. It encourages cultivating inner truth and communicating openly with yourself and others.`,
        above: bagua.bagua.xùn,
        below: bagua.bagua.duì,
        explanation: `Zhōng Fú symbolizes sincerity and the importance of authentic connections. It emphasizes the need for inner truth as the foundation for meaningful relationships and actions.`,
        judgement: `Inner truth calls for honesty and alignment with one's core values. By cultivating authenticity, one can build strong relationships and foster trust with others.`,
        image: `The image of Zhōng Fú is a wellspring of water, representing purity and clarity. The wise person acts from a place of sincerity, fostering genuine connections.`,
        lines: `- **Line 1:** Speak your truth; it sets a foundation for trust.  
        - **Line 2:** Avoid pretense; authenticity strengthens bonds.  
        - **Line 3:** Acknowledge your inner voice to guide your actions.  
        - **Line 4:** Support others in their quest for truth; it creates harmony.  
        - **Line 5:** Honor your commitments; integrity is key.  
        - **Line 6:** Fostering authenticity attracts genuine connections.`
    },
    guīmèi: {
        name: 'guī mèi, kuei mei',
        symbol: '歸妹', 
        hexagram: '䷵',
        binary: '001011',
        order: 52,   
        kingwen:54,        
        translation: 'The Marrying Maiden',   
        summary: `This hexagram symbolizes the power of union and partnership. It advises you to work together with others and to build strong relationships. It encourages you to support and care for one another and to create a sense of belonging. his hexagram symbolizes a situation where one must accept a secondary role or make compromises. It advises humility and understanding your position.`,
        above: bagua.bagua.zhèn,
        below: bagua.bagua.duì,        
        explanation: `Wèi Jī represents a situation of transition and the delicate balance of roles. It reflects the need for adaptability and the potential for growth through changing circumstances.`,
        judgement: `The marrying maiden suggests a time of significant transformation and the importance of navigating relationships with care. Embrace new roles while remaining true to your values.`,
        image: `The image of Wèi Jī is a woman on her journey to marriage, symbolizing transformation and the blending of paths. The wise person approaches new commitments with integrity and awareness.`,
        lines: `- **Line 1:** Adjust to new roles with grace and adaptability.  
        - **Line 2:** Recognize the importance of nurturing relationships.  
        - **Line 3:** Avoid losing your identity in new situations.  
        - **Line 4:** Build connections that support your growth.  
        - **Line 5:** Honor the commitments made to foster harmony.  
        - **Line 6:** Acknowledge the influence of external factors on your journey.`
    },
    kuí: {
        name: `kuí, k'uei`,
        symbol: '睽', 
        hexagram: '䷥',
        binary: '101011',
        order: 53,   
        kingwen:38,        
        translation: 'Opposition',  
        summary: `This hexagram symbolizes the power of opposition and conflict. It advises you to address the issues at hand and to find a resolution. It encourages you to communicate openly and honestly with others. This hexagram represents disagreements and contrasting viewpoints. It advises seeking common ground and mutual understanding to overcome division.`, 
        above: bagua.bagua.lí,
        below: bagua.bagua.duì,
        explanation: `Kuì signifies conflict and divergence, representing a time when opposing forces create tension. It teaches the need for understanding and finding common ground.`,
        judgement: `Opposition calls for diplomacy and open-mindedness. By respecting differences and seeking compromise, one can turn conflict into cooperation.`,
        image: `The image of Kuì is fire above the lake, symbolizing contrasting energies. The wise person finds a way to harmonize differences and build bridges.`,
        lines: `- **Line 1:** Begin with patience to resolve minor conflicts.  
        - **Line 2:** Seek common ground to bridge divides.  
        - **Line 3:** Miscommunication can lead to further opposition.  
        - **Line 4:** Understanding each other's perspective fosters unity.  
        - **Line 5:** Compromise brings lasting solutions.  
        - **Line 6:** Even deep-seated conflicts can be transformed.`
    },
    duì: {
        name: 'duì, tui',
        symbol: '兌', 
        hexagram: '䷹',
        binary: '011011',  
        order: 54,   
        kingwen:58,        
        translation: 'The Joyous, Lake',   
        summary: `This hexagram symbolizes the power of joy and celebration. It advises you to embrace the present moment and to find joy in the little things. It encourages you to celebrate your successes and to share your happiness with others. This hexagram symbolizes happiness, pleasure, and the sharing of positive energy with others. It advises cultivating joy through genuine connections and mutual support.`,
        above: bagua.bagua.duì,
        below: bagua.bagua.duì,        
        explanation: `Duì symbolizes joy, openness, and the importance of communication. It emphasizes the need for celebration and the role of positivity in fostering connection and collaboration.`,
        judgement: `The joyous encourages embracing happiness and sharing it with others. By fostering an environment of joy, relationships can flourish and creativity can thrive.`,
        image: `The image of Duì is a lake, representing the reflection of joy and harmony. The wise person spreads positivity and encourages unity through shared happiness.`,
        lines: `- **Line 1:** Seek joy in small interactions; they uplift spirits.  
        - **Line 2:** Celebrate achievements with those who supported you.  
        - **Line 3:** Spread positivity to combat negativity around you.  
        - **Line 4:** Nurture joyful connections; they enrich your life.  
        - **Line 5:** The highest joy comes from shared experiences and collaboration.  
        - **Line 6:** Avoid superficial happiness; seek depth in your joy.`
    },
    lu: {
        name: 'lü, lu',
        symbol: '履', 
        hexagram: '䷉',
        binary: '111011', 
        order: 55,   
        kingwen:10,        
        translation: 'Treading (Conduct)',   
        summary: `This hexagram symbolizes the power of action and movement. It advises you to take the first step and to move forward with confidence. It encourages you to trust the process and to be open to new opportunities. This hexagram warns against stepping into risky situations without thought. It advises maintaining balance and acting with integrity to avoid trouble.`,
        above: bagua.bagua.qián,
        below: bagua.bagua.duì,       
        explanation: `Lǚ signifies careful and deliberate movement, like treading on a tiger's tail. It emphasizes caution and awareness in your actions.`,
        judgement: `Treading with care leads to success. It is important to be mindful of potential dangers and proceed with respect and consideration.`,
        image: `The image of Lǚ is the tiger, symbolizing powerful forces. The wise person treads carefully, with awareness of their surroundings.`,
        lines: `- **Line 1:** Begin with caution; rash actions bring misfortune.  
        - **Line 2:** Maintain a steady course, even in challenging situations.  
        - **Line 3:** Balance confidence with humility to avoid mistakes.  
        - **Line 4:** Progress is safe when your steps are sure.  
        - **Line 5:** With care, even difficult paths can be navigated.  
        - **Line 6:** Reckless behavior leads to misfortune; tread lightly.`
    },
    tài: {
        name: `tài, t'ai`,
        symbol: '泰', 
        hexagram: '䷊',
        binary: '000111', 
        order: 56,   
        kingwen:11,  
        translation: 'Peace',       
        summary: `This hexagram symbolizes the power of peace and harmony. It advises you to find balance in all areas of your life and to cultivate a sense of inner peace. It encourages you to create a sense of calm and tranquility in your surroundings. This hexagram represents a time when heaven and earth are in perfect balance, bringing growth and happiness. It encourages nurturing and supporting others.`,  
        above: bagua.bagua.kūn,
        below: bagua.bagua.qián,        
        explanation: `Tài symbolizes harmony and peace, where heaven and earth are in perfect alignment. It represents a time of prosperity and balance in all aspects of life.`,
        judgement: `Peace and harmony prevail when everything is in its rightful place. This is a time for nurturing growth, fostering stability, and building strong foundations.`,
        image: `The image of Tài is heaven and earth in union, symbolizing universal harmony. The wise person maintains balance by uniting with natural laws.`,
        lines: `- **Line 1:** Small efforts create a foundation for peace.  
        - **Line 2:** Unity and trust lead to mutual support.  
        - **Line 3:** Avoid complacency; continue to nurture stability.  
        - **Line 4:** Success grows from cooperation and understanding.  
        - **Line 5:** True harmony comes from balanced leadership.  
        - **Line 6:** The peace is fragile; maintain vigilance to avoid chaos.`
    },
    dàchù: {
        name: `dà chù, ta ch'u`,
        symbol: '大畜', 
        hexagram: '䷙',
        binary: '100111', 
        order: 57,   
        kingwen:26,   
        translation: 'The Taming Power of the Great',        
        summary: `This hexagram symbolizes the power of discipline and self-control. It advises you to stay focused on your goals and to be patient with yourself. It encourages you to trust the process and to be open to new possibilities. This hexagram highlights the power of patience and inner strength. It suggests using discipline to harness your potential.`, 
        above: bagua.bagua.gèn,
        below: bagua.bagua.qián,        
        explanation: `Dà Chù represents restraint and the control of powerful forces. It teaches the importance of inner discipline and the ability to channel energy constructively.`,
        judgement: `The taming power of the great requires patience and self-control. Mastery over one's impulses allows for great achievements and lasting impact.`,
        image: `The image of Dà Chù is the mountain within the sky, representing stability. The wise person strengthens their resolve and maintains a steady course.`,
        lines: `- **Line 1:** Strength lies in knowing when to hold back.  
        - **Line 2:** Perseverance enhances one's inner power.  
        - **Line 3:** Restraint prevents potential dangers.  
        - **Line 4:** Gradual progress leads to solid results.  
        - **Line 5:** Controlled strength turns challenges into opportunities.  
        - **Line 6:** True mastery is achieved through balance and patience.`
    },
    xū: {
        name: `xū, hsu`,
        symbol: '需', 
        hexagram: '䷄',
        binary: '010111', 
        order: 58,   
        kingwen:5,
        translation: 'Waiting (Nourishment)',    
        summary: `This hexagram symbolizes the power of patience and waiting. It advises you to trust the process and to be patient with yourself. It encourages you to take a step back and to allow things to unfold naturally. This hexagram symbolizes the importance of timing and the need to wait for the right moment. Trust in the process, gather resources, and avoid rushing into action.`,      
        above: bagua.bagua.kǎn,
        below: bagua.bagua.qián, 
        explanation: `Xū represents the need for patience and readiness. It highlights the wisdom of waiting for the right moment before taking action.`,
        judgement: `Waiting with purpose leads to success. It is essential to gather strength and be prepared for the right opportunity to arise.`,
        image: `The image of Xū is clouds rising up to the heavens, signaling potential rain. The wise person remains calm and waits for the right conditions to act.`,
        lines: `- **Line 1:** Waiting in the lowest position requires faith in the process.  
        - **Line 2:** Finding patience amidst uncertainty leads to inner peace.  
        - **Line 3:** Impatience leads to discomfort; trust in timing.  
        - **Line 4:** Steady perseverance brings small gains.  
        - **Line 5:** The moment to act draws near; remain poised.  
        - **Line 6:** Waiting too long can bring regret; seize the opportunity when it arises.`           
    },
    xiǎochù: {
        name: `xiǎo chù, hsiao ch'u`,
        symbol: '小畜', 
        hexagram: '䷈',
        binary: '110111', 
        order: 59,   
        kingwen:9,  
        translation: 'The Taming Power of the Small', 
        summary: `This hexagram symbolizes the power of discipline and self-control. It advises you to stay focused on your goals and to be patient with yourself. It encourages you to trust the process and to be open to new possibilities. This hexagram advises focusing on minor adjustments and careful attention to detail, as small steps will lead to meaningful change over time.`,        
        above: bagua.bagua.xùn,
        below: bagua.bagua.qián,        
        explanation: `Xiǎo Chù represents the power of gentle influence and small, steady actions. It emphasizes the effectiveness of subtle, incremental efforts.`,
        judgement: `The Taming Power of the Small brings gradual progress. Success is found through persistence and attention to detail, without forcing outcomes.`,
        image: `The image of Xiǎo Chù is wind moving above heaven, indicating subtle influence. The wise person cultivates patience and carefully guides the situation.`,
        lines: `- **Line 1:** Small actions now will prevent future obstacles.  
        - **Line 2:** Gentle persistence brings steady growth.  
        - **Line 3:** Forceful attempts meet resistance; be patient.  
        - **Line 4:** Progress may be slow, but it is sure.  
        - **Line 5:** Consistency in small efforts leads to success.  
        - **Line 6:** Overreach leads to loss; maintain moderation.`
    },
    dàzhuàng: {
        name: `dà zhuàng, ta chuang`,
        symbol: '大壯', 
        hexagram: '䷡',
        binary: '001111', 
        order: 60,   
        kingwen:34,   
        translation: 'The Power of the Great',  
        summary: `This hexagram symbolizes the power of strength and vitality. It advises you to embrace your inner power and to step into your full potential. It encourages you to be bold and to take risks in pursuit of your goals. This hexagram emphasizes the power to achieve through bold actions. It advises using your force wisely and with intention.`,      
        above: bagua.bagua.zhèn,
        below: bagua.bagua.qián,        
        explanation: `Dà Zhuàng symbolizes great power and strength, emphasizing the importance of using one's energy wisely and with a sense of responsibility.`,
        judgement: `The power of the great must be guided by wisdom and restraint. When strength is balanced with humility, it leads to true and lasting achievements.`,
        image: `The image of Dà Zhuàng is thunder within the earth, symbolizing controlled power. The wise person uses their strength to uplift and support, not to dominate.`,
        lines: `- **Line 1:** Strength is most effective when used with care.  
        - **Line 2:** Find a balance between power and subtlety.  
        - **Line 3:** Avoid reckless use of force; consider the consequences.  
        - **Line 4:** Controlled power brings clear progress.  
        - **Line 5:** Wise leadership channels strength into constructive action.  
        - **Line 6:** Unchecked force leads to resistance and setbacks.`
    },
    dàyǒu: {
        name: 'dà yǒu, ta yu',
        symbol: '大有', 
        hexagram: '䷍',
        binary: '101111', 
        order: 61,   
        kingwen:14,    
        translation: 'Possession in Great Measure',  
        summary: `This hexagram symbolizes the power of abundance and prosperity. It advises you to be grateful for what you have and to share your blessings with others. It encourages you to cultivate a sense of abundance and to trust that there is enough for everyone. This hexagram represents great wealth, prosperity, and influence. It advises generosity, wise management of resources, and sharing with others.`,     
        above: bagua.bagua.lí,
        below: bagua.bagua.qián,        
        explanation: `Dà Yǒu represents abundance and prosperity. It highlights the responsibility that comes with great resources and the importance of using them wisely.`,
        judgement: `Possession in great measure brings wealth and success. To maintain this state, one must act with generosity, integrity, and careful management.`,
        image: `The image of Dà Yǒu is fire in the heavens, signifying brilliance and wealth. The wise person uses their resources to benefit all and shine with virtue.`,
        lines: `- **Line 1:** Wealth gained through virtue brings true fortune.  
        - **Line 2:** Generosity multiplies your abundance.  
        - **Line 3:** Handle your resources with care to avoid waste.  
        - **Line 4:** Maintain balance in both giving and receiving.  
        - **Line 5:** Success is ensured by using wealth for the greater good.  
        - **Line 6:** Pride in abundance leads to misfortune; stay humble.`
    },
    guài: {
        name: 'guài, kuai',
        symbol: '夬', 
        hexagram: '䷪',
        binary: '011111',
        order: 62,   
        kingwen:43,      
        translation: 'Break-through (Resoluteness)',  
        summary: `This hexagram symbolizes the power of breakthrough and transformation. It advises you to break free from the past and to embrace new opportunities. It encourages you to trust the process and to be open to new possibilities. This hexagram indicates the need to confront challenges head-on with determination. It encourages acting with clear purpose and honesty.`,   
        above: bagua.bagua.duì,
        below: bagua.bagua.qián,    
        explanation: `Guài represents the decisive action necessary to break through barriers and confront difficulties with unwavering resolve. It is a moment when forceful action, guided by clarity of intention, is required to dissolve stagnation or oppressive circumstances. This hexagram emphasizes that breakthroughs require not just strength, but also a clear vision of the outcome and the courage to lead the charge toward change.`,
        judgement: `Break-through. One must be resolute and determined. A strong force is needed to confront and dispel negativity, to clear the path for new growth. Success lies in uniting one's inner strength with a clear purpose, acting in a straightforward manner without hesitation. Be mindful of timing—decisiveness must be balanced with awareness of the correct moment to act.`,
        image: `The image of Guài is that of the lake rising above the sky. The superior person uses their force of character to achieve breakthrough and order, guiding others with integrity and clarity of purpose. Just as the lake eventually reaches its limits and breaks through into the sky, so too must one take action when the need for change becomes undeniable.`,
        lines: `- **Line 1:** Resolving minor issues firmly at the beginning prevents larger complications later on. It is wise to address small obstacles directly and with determination.  
    - **Line 2:** Doubts and hesitation can cloud judgment. Before taking decisive action, clarify your goals and align your intentions with your true purpose.  
    - **Line 3:** Resistance is met when the breakthrough is not fully supported. Understand that full commitment is required to push past limitations; wavering will lead to setbacks.  
    - **Line 4:** Persistence in the face of opposition brings progress. Aligning with supportive forces at this stage strengthens the breakthrough.  
    - **Line 5:** An inevitable breakthrough is reached. Your decisive action leads to success. The focus should remain on just intentions, avoiding any trace of arrogance.  
    - **Line 6:** A forceful breakthrough that comes too late or lacks support can lead to a hollow victory. Success requires both the right timing and allies to sustain progress.`,
    },    
    qián: {
        name: `qián, ch'ien`,
        symbol: '乾', 
        hexagram: '䷀',
        binary: '111111',
        order: 63,   
        kingwen:1,    
        translation: 'The Creative, Heaven',
        summary: `This hexagram symbolizes the power of creation and new beginnings. It advises you to embrace your inner power and to step into your full potential. It encourages you to be bold and to take risks in pursuit of your goals. This hexagram represents active energy, initiative, and the force to bring new ideas into reality. It signifies a time of dynamic progress and leadership.`,
        above: bagua.bagua.qián,
        below: bagua.bagua.qián,
        explanation: `Qián represents the pure, creative force that drives all things into existence. It is the source of all energy and embodies strength, clarity, and determination.`,
        judgement: `The Creative works sublime success. Perseverance brings reward. The force of Qián is unyielding and fosters growth and achievement through its continuous motion.`,
        image: `The image of Qián is the heavens moving forward with great power. The wise person emulates this by maintaining consistent focus and strong will.`,
        lines: `- **Line 1:** Hidden potential. The initial stage is one of preparation; be patient.  
        - **Line 2:** Patience pays off. Be ready to move forward when the time is right.  
        - **Line 3:** Challenges arise. Be aware of limitations to ensure progress.  
        - **Line 4:** Clarity and determination lead to renewed focus.  
        - **Line 5:** Leadership emerges with strength and wisdom.  
        - **Line 6:** Excessive force can lead to misfortune; moderation is key.`
    },
}

const seq_GreyCode = [
    2,24,19,7,46,11,36,15,
    62,55,34,32,40,54,51,16,
    45,17,58,47,28,43,49,31,
    39,63,5,48,29,60,3,8,
    20,42,61,59,57,9,37,53,
    33,13,1,44,6,10,25,12,
    35,21,38,64,50,14,30,56,
    52,22,26,18,4,41,27,23
    ];

function getHexagramByBinary(binary)
{
    let hexagram = this.sequence_binary().filter((item) => item.binary == binary);
    if (hexagram.length > 0)
    {
        return this.sequence_binary().filter((item) => item.binary == binary)[0];
    }
    else return this.hexagram.kūn;
   
}
 function sequence_kingwen()
 {
    return _.sortBy(hexagram, ['kingwen'],['asc']);
 }

 function sequence_binary()
 {
    return _.sortBy(hexagram, ['order'],['asc']);
 }
 function sequence_greycode()
 {
    let start = sequence_kingwen();
    let sequence_GreyCode = [];

    for (let i = 0; i <= start.length-1; i++)
    {     
        sequence_GreyCode.push(start[seq_GreyCode[i]-1]);
    }
    
    return sequence_GreyCode;
 }

 function getHexagramByAboveBelow(above, below)
 {
    let hexagram = this.sequence_kingwen().filter((item) => item.above == above && item.below == below);
    if (hexagram.length > 0)
    {
        return hexagram[0];
    }
    else return this.hexagram.kūn;
 }



export default
{
    hexagram,
    getHexagramByBinary,
    sequence_binary,
    sequence_kingwen,
    sequence_greycode,
    getHexagramByAboveBelow,

}