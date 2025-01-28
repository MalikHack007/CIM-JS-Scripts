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
        ["Order ID", "84381","87087","79729","88686","90169","89373","52787","84307","91959","87074","70012","69778","74953","82350","91863","79197","80957","41440","65259","88356","89125"],
        ["AIS", "Jan 28, 2025 8:29am I have made 2 separate payments for 1. USCIS Filing and Asylum Fee 2. Premium Processing Fee"," Jan 27, 2025 5:11pm The payment has been made by stripe today.","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Jan 28, 2025 10:16am - Retain for I-485/IVP Service [from customer] Hello,   We would like to retain you to apply for I-485 and could you know me the further steps to do this?   Thanks!","Please post remaining fee message","Jan 28, 2025 10:32am - Payment Questions [from customer] I have made the payment","Jan 26, 2025 6:33pm 'I have paid the USCIS filing fee via Stripe.","Jan 28, 2025 10:41am - Retain for I-485/IVP Service [from customer] Reply to message at Jan 23, 2025 12:17pm Thanks, for your reply. Yes I am definitely going retain you for my I-485 application. My I-114 is already approved as you may know. My OPT visa will expire in June 2026. Not sure if the backlog lets me to st …","Jan 28, 2025 10:52am - Payment Questions [from customer] Reply to message at Jan 27, 2025   I have paid my I140 Eb1A attorney fee. Thank you.   Siyuan","Please post remaining fee message","Please post remaining fee message","Jan 27, 2025 11:50pm Thank you for correcting the error. I have filled out the required information on the account. I will also complete the first installment of payment (4700) by tomorrow, as per the instructions received","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message","Please post remaining fee message"],
        ["Personal Notes", "1. When it comes to payments that have already been confirmed, we specify both the item and the amount: 'We are writing to confirm that we have received your I-140 filing fee, asylum program fee and premium processing fee in the amount of $3,820 via Stripe.' 2. make sure payment date (2025-01-28) is accurate","Need to remember the 'further' in 'We will respond to you further as soon as possible. Thank you!'","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Will need  to remember to sometimes assign AIS for legal advice in I-485-related messages, as client can only assign one AIS at a time.","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue","Completed Without Issue"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)