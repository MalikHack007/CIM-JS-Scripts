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
        ["Order ID", "88537","59657","77293","87359","85418","88504","71724","81644","85720","91338","31481","75680","89084","86952","55499","79766","87886","64093"],
        ["Task", "Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Jan 21, 2025 11:36am - Payment Questions [from customer] Reply to message at Jan 21, 2025 10:27am I have made a payment. I didn't see where to add my order id though, it was the credit card option. After I made the payment I also didn't see a receipt. I can provide my banking statement if necessary.","Jan 21, 2025 11:43am - Payment Questions [from customer]  Hi, just want to check if you received my payment","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message"],

        ["Personal Notes", "Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)