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
        ["Order ID", "87457", "64945", "83789", "89737", "64781", "86293", "21188", "90866", "88181", "88937", "22351", "69627", "41024", "69608", "21188", "55212", "27994"],
        ["Task", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Jan 14, 2025 8:39am Q.4 When recommendations letter fee and I-140 fee I will pay ? Q.5 If I want to proceed as a premium then the fee 2805USD when I will pay?", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Jan 15, 2025 11:04am Hello,I want to make the payment for the filing fees. Can you please send me the detailed instructions for the same?Regards,Deep", "Please post remaining fees", "Please post remaining fees"],

        ["Personal Notes", "Completed without issue", "Completed without issue", "need to add 'We will respond to you further as soon as possible'", "Completed without issue", "Completed without issue", "Completed without issue", "Completed without issue", "whenever possible, try to give client the most complete information, in this case, we are referring back to his contract to give him a clear idea about when and how much he will pay", "Completed without issue", "Completed without issue", "Oversight: Didn't see that PP Info has already been provided to client.", "Completed without issue", "Completed without issue", "Completed without issue", "client ended up not needing help since he was able to make the payment", "Completed without issue", "Completed without issue"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)