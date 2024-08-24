INSERT INTO public.questions (q_order, question, category, sub_category, q_type) VALUES 
(1, 'Industry: What industry does your customer''s company belong to?', 'Persona B2B', 'Background Information', 'select'),
(2, 'Company Size: How many employees are there in your customer''s company?', 'Persona B2B', 'Background Information', 'number'),
(3, 'Department Size: How many people are in your customer''s department?', 'Persona B2B', 'Background Information', 'number'),
(4, 'Job Title: What is your customer''s job title?', 'Persona B2B', 'Background Information', 'text'),
(5, 'Age: What is your customer''s age?', 'Persona B2B', 'Background Information', 'number'),
(6, 'Education: What is the highest level of education your customer has completed?', 'Persona B2B', 'Background Information', 'select'),
(7, 'Income: What is your customer''s annual income range?', 'Persona B2B', 'Background Information', 'select'),
(8, 'Professional Background: Can your customer briefly describe their professional background?', 'Persona B2B', 'Background Information', 'multiline'),
(9, 'Responsibilities: What are your customer''s main responsibilities?', 'Persona B2B', 'Background Information', 'multiline'),
(10, 'Years in Role: How many years has your customer been in their current role?', 'Persona B2B', 'Background Information', 'number'),
(11, 'Highest Priority: What is your customer''s highest priority at work right now?', 'Persona B2B', 'Current Situation', 'multiline'),
(12, 'Recent Changes: Have there been any recent changes in your customer''s department or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(13, 'Market Forces: What market forces are currently affecting your customer''s work?', 'Persona B2B', 'Current Situation', 'multiline'),
(14, 'Pain Points: What are the biggest challenges your customer faces in their role?', 'Persona B2B', 'Current Situation', 'multiline'),
(15, 'Triggers: What triggers the need for changes or decisions in your customer''s role?', 'Persona B2B', 'Current Situation', 'multiline'),
(16, 'Obstacles: What obstacles is your customer currently facing at work?', 'Persona B2B', 'Current Situation', 'multiline'),
(17, 'Other Initiatives: Are there any other major initiatives your customer is involved in?', 'Persona B2B', 'Current Situation', 'multiline'),
(18, 'Motivation: What motivates your customer in their job?', 'Persona B2B', 'Current Situation', 'multiline'),
(19, 'Goals: What are your customer''s key goals for the next year?', 'Persona B2B', 'Current Situation', 'multiline'),
(20, 'Needs: What does your customer need to achieve these goals?', 'Persona B2B', 'Current Situation', 'multiline'),
(21, 'Objectives: What are your customer''s main objectives at work?', 'Persona B2B', 'Current Situation', 'multiline'),
(22, 'Media Consumption: What types of media does your customer consume regularly?', 'Persona B2B', 'Current Situation', 'multi-select'),
(23, 'Likes: What does your customer particularly like about their industry or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(24, 'Dislikes: What does your customer dislike about their industry or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(25, 'Skills: What key skills does your customer rely on in their role?', 'Persona B2B', 'Current Situation', 'multiline'),
(26, 'Research Methods: How does your customer generally conduct research for work?', 'Persona B2B', 'Current Situation', 'multiline'),
(27, 'Trusted Resources: What are your customer''s go-to resources for professional information?', 'Persona B2B', 'Current Situation', 'multi-select'),
(28, 'Reports To: Who does your customer report to?', 'Persona B2B', 'Decision-Making', 'text'),
(29, 'Budget: Is your customer responsible for a budget? If so, what size?', 'Persona B2B', 'Decision-Making', 'text'),
(30, 'Buying Power: Does your customer have the authority to make purchasing decisions?', 'Persona B2B', 'Decision-Making', 'select'),
(31, 'Purchasing Process: Can your customer describe their typical purchasing process?', 'Persona B2B', 'Decision-Making', 'multiline'),
(32, 'Purchase History: What significant purchases has your customer made recently?', 'Persona B2B', 'Decision-Making', 'multiline'),
(33, 'Key Stakeholders: Who are the key stakeholders in your customer''s purchasing decisions?', 'Persona B2B', 'Decision-Making', 'multiline'),
(34, 'Business Alignment: How do your customer''s decisions align with business objectives?', 'Persona B2B', 'Decision-Making', 'multiline'),
(35, 'Management Commitment: How committed is your customer''s management to supporting their decisions?', 'Persona B2B', 'Decision-Making', 'multiline');


-- put q_options for questions select and multi-select here

INSERT INTO public.question_options (question_id, q_option)
WITH q AS (
  SELECT id, q_order FROM questions WHERE q_type = 'select' or q_type = 'multi-select'
),
q_options AS (
    SELECT 1 as q_order, 'Agriculture, Forestry, Fishing and Hunting' as q_option UNION ALL 
    SELECT 1 as q_order, 'Mining, Quarrying, and Oil and Gas Extraction' as q_option UNION ALL
    SELECT 1 as q_order, 'Utilities' as q_option UNION ALL
    SELECT 1 as q_order, 'Construction' as q_option UNION ALL
    SELECT 1 as q_order, 'Manufacturing' as q_option UNION ALL
    SELECT 1 as q_order, 'Wholesale Trade' as q_option UNION ALL
    SELECT 1 as q_order, 'Retail Trade' as q_option UNION ALL
    SELECT 1 as q_order, 'Transportation and Warehousing' as q_option UNION ALL
    SELECT 1 as q_order, 'Information' as q_option UNION ALL
    SELECT 1 as q_order, 'Finance and Insurance' as q_option UNION ALL
    SELECT 1 as q_order, 'Real Estate and Rental and Leasing' as q_option UNION ALL
    SELECT 1 as q_order, 'Professional, Scientific, and Technical Services' as q_option UNION ALL
    SELECT 1 as q_order, 'Management of Companies and Enterprises' as q_option UNION ALL
    SELECT 1 as q_order, 'Administrative and Support and Waste Management and Remediation Services' as q_option UNION ALL
    SELECT 1 as q_order, 'Educational Services' as q_option UNION ALL
    SELECT 1 as q_order, 'Health Care and Social Assistance' as q_option UNION ALL
    SELECT 1 as q_order, 'Arts, Entertainment, and Recreation' as q_option UNION ALL
    SELECT 1 as q_order, 'Accommodation and Food Services' as q_option UNION ALL
    SELECT 1 as q_order, 'Other Services (except Public Administration)' as q_option UNION ALL
    SELECT 1 as q_order, 'Public Administration' as q_option UNION ALL
    SELECT 1 as q_order, 'Other' as q_option UNION ALL
    SELECT 6 as q_order, 'High School' as q_option UNION ALL
    SELECT 6 as q_order, 'Associate''s Degree' as q_option UNION ALL
    SELECT 6 as q_order, 'Bachelor''s Degree' as q_option UNION ALL
    SELECT 6 as q_order, 'Master''s Degree' as q_option UNION ALL
    SELECT 6 as q_order, 'Doctoral Degree' as q_option UNION ALL
    SELECT 6 as q_order, 'Other' as q_option UNION ALL
    SELECT 7 as q_order, 'Less than $25,000' as q_option UNION ALL
    SELECT 7 as q_order, '$25,000 - $50,000' as q_option UNION ALL
    SELECT 7 as q_order, '$50,000 - $75,000' as q_option UNION ALL
    SELECT 7 as q_order, '$75,000 - $100,000' as q_option UNION ALL
    SELECT 7 as q_order, '$100,000 - $150,000' as q_option UNION ALL
    SELECT 7 as q_order, '$150,000 - $200,000' as q_option UNION ALL
    SELECT 7 as q_order, '$200,000 - $250,000' as q_option UNION ALL
    SELECT 7 as q_order, '$250,000 - $300,000' as q_option UNION ALL
    SELECT 7 as q_order, '$300,000 - $400,000' as q_option UNION ALL
    SELECT 7 as q_order, '$400,000 - $500,000' as q_option UNION ALL
    SELECT 7 as q_order, '$500,000 - $750,000' as q_option UNION ALL
    SELECT 7 as q_order, '$750,000 - $1,000,000' as q_option UNION ALL
    SELECT 7 as q_order, 'More than $1,000,000' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry News' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Blogs' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Forums' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Conferences' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Webinars' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Podcasts' as q_option UNION ALL
    SELECT 22 as q_order, 'Industry Social Media' as q_option UNION ALL
    SELECT 22 as q_order, 'Other' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry News' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Blogs' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Forums' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Conferences' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Webinars' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Podcasts' as q_option UNION ALL
    SELECT 27 as q_order, 'Industry Social Media' as q_option UNION ALL
    SELECT 27 as q_order, 'Other' as q_option UNION ALL
    SELECT 27 as q_order, 'None' as q_option
)
SELECT q.id, q_options.q_option FROM q INNER JOIN q_options ON q.q_order = q_options.q_order;
