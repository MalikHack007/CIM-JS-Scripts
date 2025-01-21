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
        ["Order ID", "91392","85099","57338","82855","88351","28918","89610","87204","76184","88659","81392","83399"],
        ["Task", "Jan 17, 2025 9:31am - Payment Questions [from customer] Hi! I have paid the remaining $1700 to your BOA account, please let me know if you receive any notifications. Thanks!","Pllease post remaining fees","Jan 17, 2025 8:29am [Please advise on this] Hello, I am looking at the section you have on 'B. If you will undergo Immigrant Visa processing (IVP) overseas' for the February bulletin and I am","Please post remaining fee message","Please collect remaining attorney fee due upon pl","Please collect remaining attorney fee due upon pl","Pllease post remaining fees","Pllease post remaining fees","Pllease post remaining fees","Pllease post remaining fees","Pllease post remaining fees","Pllease post remaining fees"],

        ["Personal Notes", "Need to add 'for the remaining $1,700' - if client made multiple transactions for one single payment, we will need to specify the payment amount we are currently following up on. ","Completed without issue","AIS description can be simplified when client sends a long paragraph","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Client had indicated he wants to file for PP initially, however, after receiving our PP warning, they never confirmed his PP plan with us via message. I ignored the fact that he recently updated his client record to be no PP for both cases, and billed for PP by mistake. I will pay more attention to the CR record last updated date next time."]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)