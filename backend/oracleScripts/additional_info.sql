-- Add a new column for image URL
ALTER TABLE book
ADD image_url VARCHAR2(255);

-- Add a new column for rating (assuming a numeric rating)
ALTER TABLE book
ADD rating NUMBER(5, 2);

-- Add a new column for overview (assuming a text description)
ALTER TABLE book
ADD overview CLOB;