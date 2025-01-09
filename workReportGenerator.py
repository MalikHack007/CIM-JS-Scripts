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
        ["Order ID", 88963, 85832, 64519],
        ["Internal Notes", "Client called, asked about filling out item 23 - marital status in the client record.\n\n1. Asked what the 'Green Card Application Process' refers to. I told him it refers to the period starting from when USCIS receives his I-140 petition. (Please correct it if this answer is not accurate.)\n\n2. He is also wondering about the implication of having a marriage plan and how it can affect his green card application process.\n\n3. Lastly, please further clarify to client how to fill out Item 23, as he seems to have some reservations.",
    "Client called, he feels like the wait time for GC is too long for NIW China-Born applicants. I also told him it could be more or less than 4 years, depending on visa availability vs application volume.\n\nSubsequently he wants to know if we can be retained for his I-140 EB1A, if not what else can he do to increase his credentials so that he can retain us in the future for EB1A.\n\nInternal Translation/Notes:\n\nSpecifically, he wants to know how many publications, citations, and peer reviews he needs.\n\nCreated at 01/09/2025 4:56 pm by Malik Zhang",
    "Client called. Asked about how to prepare the Exhibit 26 in Petition Letter, told client that they only need to prepare evidence for highlighted exhibits. Also pointed client to client packet -> appendix c -> document list for detailed instructions on how to prepare evidence for all of the exhibits." ],

        ["Personal Notes", "Since this involves both legal consultation and CR record, we double assign the AIS to CR team and the attorney. Next time, I can better clarify with the client to see exactly where their problem lies. ",
        "Over the phone, we don’t give out a specific number for citation/publication needed to retain us\n for EB1A. Simply tell them we will pass that question to the attorney. Additionally, please \nnote that for existing clients, they do not have to go through the evaluation form on the \nwegreened website, instead, assign an AIS to I-140 Eval team to further proceed.",
        "Please note that ONLY the highlighted exhibits are to be prepared by the clients. "]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)