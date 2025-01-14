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
        ["Order ID", "83783", "85595", "53525", "89414", "83460", "87379", "89985", "71957", "73989", "86754", "90545", "25661", "90176", "89150", "85124", "88314", "83471", "55807", "81703", "69004", "69079", "85515", "71819", "67507", "67507"],
        ["Task", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please collect remaining attorney fee due upon pl", "Please post remaining fees", "Please collect remaining attorney fee due upon pl", "Please collect remaining attorney fee due upon pl", "Please post remaining fees", "Please collect remaining attorney fee due upon pl", "Please post remaining fees", "Please collect remaining attorney fee due upon pl", "Please post remaining fees", "Please collect remaining attorney fee due upon pl", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Please post remaining fees", "Jan 14, 2025 12:33pm The invoice was paid at Jan 14, 2025 12:32 pm. If you have any questions, please don't hesitate to contact us."],

        ["Personal Notes", "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "Completed without issue",
    "If a client is expecting any sort of response, acknowledgment from us, we need to add 'We will respond to you further as soon as possible'",
    "Completed without issue",
    "Need to update the beginning of msg to 'Thank you for your messages.' because we are acknowledging both messages at the same time"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)