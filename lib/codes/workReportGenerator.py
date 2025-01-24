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
        ["Order ID", "88572","86731","70816","90623","91360","57243","61408","81006","66171","84457","46056","86468","59616","77038"],
        ["AIS", "Jan 23, 2025 3:07am - Payment Questions [from customer] Dear Chen Immigration Billing Dept, I wanted to inform you that I have completed a wire transfer of $1,015 USD as payment. The proof of payment has also been uploaded to the Documents section under my account for your reference. Thank you, and ","Jan 22, 2025 5:02pmI have submitted a payment of $1015 to you via Stripe today for I-140 filing fee","Jan 22, 2025 10:51pm I have made a direct debit payment with stripe in 1/16","Jan 22, 2025 10:43pm Thank you for your reminder, I have made the payments online and did not find the attachment option for the payment receipts. If you guid me regarding attachemnt i can send receipts too. CONFIRMATION CODE IS BELOW. 1- WFCT0YG8ZM6T (900 USD) 2- PNCAA0Peb86a (1500 USD) 3- PNCAA0Pec07R (500 USD)","Jan 23, 2025 10:09am - Payment Questions [from customer] Reply to message at Jan 22, 2025 8:59pm I have made the second payment ($1200). Completed!","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees","Please post remaining fees"],

        ["Personal Notes", "Completed without issue","Need to remember to add 'We will respond to you further as soon as possible'","1. when sending message to confirm Stripe ACH payment, we refer it as 'Stripe' instead of 'Stripe ACH' as the payment will be deposited to our Stripe account. 2. when posting message for 2nd case activation, we add 'We will respond to you further as soon as possible.' to the end of our message as I-140 team will follow up on the detailed instructions later","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","Completed without issue","client's earlier PD is based on approved EB-1B, not NIW"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)