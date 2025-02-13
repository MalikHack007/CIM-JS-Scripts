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
        ["Order ID", "79086","83087","59072","92097","89436","91093","92582","57894","69773","76904","89218","85389","86910","88394","83608","79619","77722","81043","83111","86776","86887","88065","89381","86257","92634","88021","61138","68801","88722","68606","80335"],
        ["Call Summary", "Feb 09, 2025 6:30pm - Retain for I-485/IVP Service [from customer] Dear Attorney,   My I-140 petition has been approved by USCIS.    I am considering to retain your services for I-485 application. I'll be applying for myself, my wife and my son (6 years old). Could you please provide more details …","Feb 07, 2025 10:48pm - Retain for I-485/IVP Service [from customer] Hello,   We just found out my I-140 has been approved. Would you mind reminding us about the workflow, timeline, preparations, and your service fee for the I-485 filing?   Thanks!","Feb 07, 2025 1:55pm 1. Could you provide me a receipt so that I can reimburse to my employer (My employer said this can be reimburse);","Feb 09, 2025 9:27pm I plan on submitting the complete payment by 02/15/2025, is that okay? Additionally, if I plan on retaining your services for I-485 if the I-140 is approved, when would I have to pay for that?","Feb 07, 2025 5:58pm & Feb 09, 2025 8:47pm Could you please generate a new invoice for the premium processing fee at your earliest convenience?//Could you kindly issue a new invoice to reflect this update?","Feb 10, 2025 11:42am - Payment Questions [from customer] Reply to message at Feb 09, 2025 9:13pm I made the $100 payment through Zelle from my wife's Bank of America account. Please confirm. After that I will transfer remaining $4600.  ","Feb 10, 2025 11:56am - Payment Questions [from customer] Hi! I just sent the remaining $2200 NIW fee via Zelle (I sent $2500 yesterday). I've uploaded the second payment receipt. Let me know when all payments are posted on your account. Thanks!","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Feb 10, 2025 1:15pm - Payment Questions [from customer] Reply to message at Feb 10, 2025 I plan to pay via zelle.  I don't know if zelle has daily limit, if it does I will make payment in a week for same order number.    Thanks ","Feb 10, 2025 1:07pm - Payment Questions [from customer] Reply to message at Feb 09, 2025 10:04pm   I just made the payment of $37.16. Thank you!  e","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)