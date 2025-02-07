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
        ["Order ID", "48576","84203","80460","90467","92081","63875","89483","70258","87952","89293","52903","92364","83664"],
        ["AIS", "Feb 05, 2025 10:02am . I have paid the I-140 filing fee using my debit card through Stripe;","Feb 06, 2025 7:35am - Retain for I-485/IVP Service [from customer] Reply to message at Feb 05, 2025   Thank you for your answers to my questions. I would like to go ahead with the next steps for I-485 with your firm. What questions can I answer at this point in time while we are waiting for the approval not …","Feb 05, 2025 1:49pm The filing fee has been paid via Stripe on ACH.","Feb 05, 2025 10:42pm Could you please share a PDF invoice similar to 'Invoice_Wang_90467_First Installment of I-140 Attorney Fee.pdf' under Additional Documents?","Feb 05, 2025 12:14pm 'I haven't been able to download my client package so please let me know what to do next for my NIW filing.'","Feb 06, 2025 9:49am - Retain for I-485/IVP Service [from customer] Hello,   Hope all is well. Thank you again for handling my I-140! Even though my PD is not current, I have decided to retain your service for my 485 application so that I can start preparing the materials early under your guidance. Can you ple …","Feb 06, 2025 10:12am - Payment Questions [from customer] Reply to message at Feb 05, 2025 7:44pm   Thanks for your update.  I have transferred remaining $114.93 through Zelle. The confirmation number is WFCT0YHPH8FH.  Please confirm when you receive, and upload a paid invoice report in t …","Feb 05, 2025 10:40am Also, how much would you charge if i retain you for my I-485 service?","Feb 05, 2025 10:38pm I just made the payment for 300 Dollars and I believe you should be able to see it in the system.","Feb 06, 2025 10:25am Payment made.","Feb 06, 2025 10:58am 'I have sent another $2000.'","Feb 06, 2025 11:25am - Payment Questions [from customer] Reply to message at Feb 04, 2025 8:33pm Good Morning,   I made the initial payment through Zelle. Could you please verify it?   Best regards,","Pending (Inactive)"],
        ["Feedback", "good!","good!","good!","good!","1. need to assign an AIS to CR for the rest of client's message.  2. For the Billing page, we reflect payment initiation date for Stripe ACH payment","it would be good if we can also provide client with the USCIS fees info as the rate mentioned in our Jan 15, 2024 11:00pm message is outdated","good!","good!","good!","please proceed with EB1A account activation and add 'We will respond to you further as soon as possible'","good - slightly tweaked the wording and phrasing ","we should still be able to activate the account even though it is just a test payment in 1 dollar","good!"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)