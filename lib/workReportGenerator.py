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
        ["Order ID", "73205", "80433", "85983", "87803", "89534", "87476", "47471", "89049", "61442", "66476", "69118", "75248", "59332", "89128", "85264", "76770", "65200", "79791", "78362", "44042"],
        ["Task",
        "Jan 13, 2025 8:57am - Retain for I-485/IVP Service [from customer] Reply to message at Jan 13, 2025 I uploaded an updated I-485 evaluation questionnaire with an explanation added for question 12.    The explanation is below.   \"My wife got a traffic citation on 10/2024 for high speed (travelling …",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please collect attorney fee Due Upon PL and update Due Upon PL date in Billing Info",
        "Please collect attorney fee Due Upon PL and update Due Upon PL date in Billing Info",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please collect attorney fee Due Upon PL and update Due Upon PL date in Billing Info",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message",
        "Please post remaining fee message"],

        ["Personal Notes",
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
        "Be sure to check the messages for overpayment as well. Sometimes there will be some unresolved overpayment leading up to remaining fee collection, like this one.",
        "Completed without issue",
        "Completed without issue",
        "Completed without issue",
        "Completed without issue",
        "Completed without issue",
        "Completed without issue",
        "Service Center related question should be assigned to forms/CM team."]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)