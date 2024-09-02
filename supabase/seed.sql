INSERT INTO public.questions (id, q_order, question, category, sub_category, q_type) VALUES 
(1, 1, 'Industry: What industry does your customer''s company belong to?', 'Persona B2B', 'Background Information', 'select'),
(2, 2, 'Company Size: How many employees are there in your customer''s company?', 'Persona B2B', 'Background Information', 'number'),
(3, 3, 'Department Size: How many people are in your customer''s department?', 'Persona B2B', 'Background Information', 'number'),
(4, 4, 'Job Title: What is your customer''s job title?', 'Persona B2B', 'Background Information', 'text'),
(5, 5, 'Age: What is your customer''s age range?', 'Persona B2B', 'Background Information', 'text'),
(36, 5, 'Gender: What is the gender of your persona?(you can choose not to specify)', 'Persona B2B', 'Background Information', 'text'),
(38, 5, 'Ethnicity: What is the ethnicity of your persona?(you can choose not to specify)', 'Persona B2B', 'Background Information', 'text'),
(37, 5, 'Location: Where do you think your persona is located?', 'Persona B2B', 'Background Information', 'text'),
(6, 6, 'Education: What is the highest level of education your customer has completed?', 'Persona B2B', 'Background Information', 'select'),
(7, 7, 'Income: What is your customer''s annual income range?', 'Persona B2B', 'Background Information', 'select'),
(8, 8, 'Professional Background: Can your customer briefly describe their professional background?', 'Persona B2B', 'Background Information', 'multiline'),
(9, 9, 'Responsibilities: What are your customer''s main responsibilities?', 'Persona B2B', 'Background Information', 'multiline'),
(10, 10, 'Years in Role: How many years has your customer been in their current role?', 'Persona B2B', 'Background Information', 'number'),
(11, 11, 'Highest Priority: What is your customer''s highest priority at work right now?', 'Persona B2B', 'Current Situation', 'multiline'),
(12, 12, 'Recent Changes: Have there been any recent changes in your customer''s department or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(13, 13, 'Market Forces: What market forces are currently affecting your customer''s work?', 'Persona B2B', 'Current Situation', 'multiline'),
(14, 14, 'Pain Points: What are the biggest challenges your customer faces in their role?', 'Persona B2B', 'Current Situation', 'multiline'),
(15, 15, 'Triggers: What triggers the need for changes or decisions in your customer''s role?', 'Persona B2B', 'Current Situation', 'multiline'),
(16, 16, 'Obstacles: What obstacles is your customer currently facing at work?', 'Persona B2B', 'Current Situation', 'multiline'),
(17, 17, 'Other Initiatives: Are there any other major initiatives your customer is involved in?', 'Persona B2B', 'Current Situation', 'multiline'),
(18, 18, 'Motivation: What motivates your customer in their job?', 'Persona B2B', 'Current Situation', 'multiline'),
(19, 19, 'Goals: What are your customer''s key goals for the next year?', 'Persona B2B', 'Current Situation', 'multiline'),
(20, 20, 'Needs: What does your customer need to achieve these goals?', 'Persona B2B', 'Current Situation', 'multiline'),
(21, 21, 'Objectives: What are your customer''s main objectives at work?', 'Persona B2B', 'Current Situation', 'multiline'),
(22, 22, 'Media Consumption: What types of media does your customer consume regularly?', 'Persona B2B', 'Current Situation', 'multi-select'),
(23, 23, 'Likes: What does your customer particularly like about their industry or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(24, 24, 'Dislikes: What does your customer dislike about their industry or role?', 'Persona B2B', 'Current Situation', 'multiline'),
(25, 25, 'Skills: What key skills does your customer rely on in their role?', 'Persona B2B', 'Current Situation', 'multiline'),
(26, 26, 'Research Methods: How does your customer generally conduct research for work?', 'Persona B2B', 'Current Situation', 'multiline'),
(27, 27, 'Trusted Resources: What are your customer''s go-to resources for professional information?', 'Persona B2B', 'Current Situation', 'multi-select'),
(28, 28, 'Reports To: Who does your customer report to?', 'Persona B2B', 'Decision-Making', 'text'),
(29, 29, 'Budget: Is your customer responsible for a budget? If so, what size?', 'Persona B2B', 'Decision-Making', 'text'),
(30, 30, 'Buying Power: Does your customer have the authority to make purchasing decisions?', 'Persona B2B', 'Decision-Making', 'select'),
(31, 31, 'Purchasing Process: Can your customer describe their typical purchasing process?', 'Persona B2B', 'Decision-Making', 'multiline'),
(32, 32, 'Purchase History: What significant purchases has your customer made recently?', 'Persona B2B', 'Decision-Making', 'multiline'),
(33, 33, 'Key Stakeholders: Who are the key stakeholders in your customer''s purchasing decisions?', 'Persona B2B', 'Decision-Making', 'multiline'),
(34, 34, 'Business Alignment: How do your customer''s decisions align with business objectives?', 'Persona B2B', 'Decision-Making', 'multiline'),
(35, 35, 'Management Commitment: How committed is your customer''s management to supporting their decisions?', 'Persona B2B', 'Decision-Making', 'multiline')
ON CONFLICT(id) 
DO UPDATE SET
  q_order = EXCLUDED.q_order,
  question = EXCLUDED.question,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  q_type = EXCLUDED.q_type;

-- 
--put q_options for questions select and multi-select here

INSERT INTO public.question_options (question_id, q_option)
WITH q AS (
  SELECT id, q_order FROM questions WHERE q_type = 'select' or q_type = 'multi-select'
),
q_options AS (
    SELECT 1 as id, 'Agriculture, Forestry, Fishing and Hunting' as q_option UNION ALL 
    SELECT 1 as id, 'Mining, Quarrying, and Oil and Gas Extraction' as q_option UNION ALL
    SELECT 1 as id, 'Utilities' as q_option UNION ALL
    SELECT 1 as id, 'Construction' as q_option UNION ALL
    SELECT 1 as id, 'Manufacturing' as q_option UNION ALL
    SELECT 1 as id, 'Wholesale Trade' as q_option UNION ALL
    SELECT 1 as id, 'Retail Trade' as q_option UNION ALL
    SELECT 1 as id, 'Transportation and Warehousing' as q_option UNION ALL
    SELECT 1 as id, 'Information' as q_option UNION ALL
    SELECT 1 as id, 'Finance and Insurance' as q_option UNION ALL
    SELECT 1 as id, 'Real Estate and Rental and Leasing' as q_option UNION ALL
    SELECT 1 as id, 'Professional, Scientific, and Technical Services' as q_option UNION ALL
    SELECT 1 as id, 'Management of Companies and Enterprises' as q_option UNION ALL
    SELECT 1 as id, 'Administrative and Support and Waste Management and Remediation Services' as q_option UNION ALL
    SELECT 1 as id, 'Educational Services' as q_option UNION ALL
    SELECT 1 as id, 'Health Care and Social Assistance' as q_option UNION ALL
    SELECT 1 as id, 'Arts, Entertainment, and Recreation' as q_option UNION ALL
    SELECT 1 as id, 'Accommodation and Food Services' as q_option UNION ALL
    SELECT 1 as id, 'Other Services (except Public Administration)' as q_option UNION ALL
    SELECT 1 as id, 'Public Administration' as q_option UNION ALL
    SELECT 1 as id, 'Other' as q_option UNION ALL
    SELECT 6 as id, 'High School' as q_option UNION ALL
    SELECT 6 as id, 'Associate''s Degree' as q_option UNION ALL
    SELECT 6 as id, 'Bachelor''s Degree' as q_option UNION ALL
    SELECT 6 as id, 'Master''s Degree' as q_option UNION ALL
    SELECT 6 as id, 'Doctoral Degree' as q_option UNION ALL
    SELECT 6 as id, 'Other' as q_option UNION ALL
    SELECT 7 as id, 'Less than $25,000' as q_option UNION ALL
    SELECT 7 as id, '$25,000 - $50,000' as q_option UNION ALL
    SELECT 7 as id, '$50,000 - $75,000' as q_option UNION ALL
    SELECT 7 as id, '$75,000 - $100,000' as q_option UNION ALL
    SELECT 7 as id, '$100,000 - $150,000' as q_option UNION ALL
    SELECT 7 as id, '$150,000 - $200,000' as q_option UNION ALL
    SELECT 7 as id, '$200,000 - $250,000' as q_option UNION ALL
    SELECT 7 as id, '$250,000 - $300,000' as q_option UNION ALL
    SELECT 7 as id, '$300,000 - $400,000' as q_option UNION ALL
    SELECT 7 as id, '$400,000 - $500,000' as q_option UNION ALL
    SELECT 7 as id, '$500,000 - $750,000' as q_option UNION ALL
    SELECT 7 as id, '$750,000 - $1,000,000' as q_option UNION ALL
    SELECT 7 as id, 'More than $1,000,000' as q_option UNION ALL
    SELECT 22 as id, 'Industry News' as q_option UNION ALL
    SELECT 22 as id, 'Industry Blogs' as q_option UNION ALL
    SELECT 22 as id, 'Industry Forums' as q_option UNION ALL
    SELECT 22 as id, 'Industry Conferences' as q_option UNION ALL
    SELECT 22 as id, 'Industry Webinars' as q_option UNION ALL
    SELECT 22 as id, 'Industry Podcasts' as q_option UNION ALL
    SELECT 22 as id, 'Industry Social Media' as q_option UNION ALL
    SELECT 22 as id, 'Other' as q_option UNION ALL
    SELECT 27 as id, 'Industry News' as q_option UNION ALL
    SELECT 27 as id, 'Industry Blogs' as q_option UNION ALL
    SELECT 27 as id, 'Industry Forums' as q_option UNION ALL
    SELECT 27 as id, 'Industry Conferences' as q_option UNION ALL
    SELECT 27 as id, 'Industry Webinars' as q_option UNION ALL
    SELECT 27 as id, 'Industry Podcasts' as q_option UNION ALL
    SELECT 27 as id, 'Industry Social Media' as q_option UNION ALL
    SELECT 27 as id, 'Other' as q_option UNION ALL
    SELECT 27 as id, 'None' as q_option
)
SELECT q.id, q_options.q_option FROM q INNER JOIN q_options ON q.id = q_options.id;
