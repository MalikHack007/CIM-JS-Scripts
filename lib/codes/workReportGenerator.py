def generate_work_report(data):
 # Initialize the table with the opening <table> tag
    html = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 20px auto;">\n'
    
    # Create the header row using the first element from each array
    html += '  <thead>\n    <tr>\n'
    for col in data:
        # Use the first element from each array for the header
        header_value = col[0] if col else 'No Header'
        html += f'      <th style="padding: 10px; text-align: center;">{header_value}</th>\n'
    html += '    </tr>\n  </thead>\n'

    # Create the body of the table
    html += '  <tbody>\n'
    # Get the number of rows by finding the maximum length of the subarrays
    max_rows = max(len(col) for col in data)
    
    for row_index in range(1, max_rows):  # Start from 1 to skip the header row
        html += '    <tr>\n'
        for col in data:
            # Fill missing values with empty strings
            value = col[row_index] if row_index < len(col) else ''
            html += f'      <td style="padding: 10px; text-align: center; vertical-align: middle;">{value}</td>\n'
        html += '    </tr>\n'
    
    html += '  </tbody>\n'
    html += '</table>\n'
    
    return html

if __name__ == '__main__':
    # Example 2D array (you can modify this to test with different data)
    data = [
        ["Order ID", "78313","79932","LEAD #237470","(979) 209-4754","62456"],
        ["Call Summary", "Client called, he is wondering: 1. whether he is subject to the 212(e) requirement. He told me on his visa stamp it states that he IS subject to the 212(e) requirement. However, he references some 'new policy' that came out last year which could potentially exempt him from such a requirement. 2. If he is subject to such requirement, how is it going to affect his green card application timeline? Currently he plans to do IVP.","Client called: 1. He wants know what we mean by 'regular service', so I explained to him that it means we will not be offering any refund in the event of a case denial.  2. He wonders how long is the EB1A case prep going to take. I told him 2-4 months depending on the number of recommendation letters you choose. 3. He wonders if he needs to draft his own recommendation letters. I told him our firm will draft the recommendation letters. He only need to contact the recommenders and get signatures from them. 4. He is interested in filing I-485 with us. I told him we currently do not file I-485 and EB1A concurrently. However, once the case is filed and he gets his EB1A receipt notice, we will be able to assist. I also let him know our attorney fee for I-485, as well as I-485 filing fees. 5. He would like to retain us for the EB1A case prep. Please advise.","Lead called, 1. She wonders when she will receive the evaluation result, I told her in 1-2 business days. 2. She wants to know, with all of our physical offices, does she need to come in at any point to discuss her case. I told her no, usually we communicate with our clients via messaging, email, and phone. 3. She wonders at which point will she pay, I told her she will be expected to pay first installment attorney fee after retainer agreement is finalized and signed by both parties. 4. She wants to know if she will be able to discuss her case with anyone before she signs the retainer agreement, I told her yes she can ask any questions she may have by replying to our future email with her evaluation result. Translation: I neglected the fact that this is a rejected lead, so I called her back and explained that at this moment we will be unable to take on her case. She wants an explanation to which I told her an email with explanation will be sent by our attorney. ","Potential client with experience in Urban Planning - citation 140/10 publication/some peer review experience. I told him to go on wegreened.com to submit free evaluation form.","Client called: He is wondering about the following: 1. He has shifted his research focus to cancer therapy. He is wondering if he is able to incoporate that into his petition letter, and potentially shift his petition letter's emphasis onto cancer therapy? He told me his current mentor at work suggested this idea to him.  I told him usually at this stage we don't do major petition letter revisions, but I will still pass on the note to our attorney. 2. He wants to know, if the current immigration policy favors certain fields, and he is wondering if cancer therapy as a research field would be more preferable than the research field mentioned in his petition letter (Immunology/Virology) He wants to know if a reassement of his petition letter is neccessary.If this helps, he told me he does not have much academic contribution in his new research direction (cancer therapy) yet. I told him we usually prefer to emphasis the field that he has the most evidence of contribution for."],
        ["Personal Notes", "No Notes","No Notes","There are leads that are automatically rejected in our system with no email sent out yet.  Moving forward, I woud not let them know in advance about their rejection, but instead let them know to be on the look out for an email containing the eval result.","No Notes","No Notes"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)