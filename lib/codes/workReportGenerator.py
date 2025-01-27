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
        ["Order ID", "85111","85658","91782","91727","81006","64699","91636","88861","79868","73893","86696","66371","75840","82372","86835","75437"],
        ["AIS", "Jan 24, 2025 7:50am - Retain for I-485/IVP Service [from customer] Reply to message at Jan 24, 2025 Thank you for the $100 token of appreciation! I would like to retain you for the I-485 application, and therefore opt for the $300 attorney fee discount.   I would also like further response to my questions on …","Jan 24, 2025 9:38am - Payment Questions [from customer] Reply to message at Jan 22, 2025 Hi,   My bank has processed it. Could you check if you received it and process the case?   Best, Doris","Jan 24, 2025 10:09am - Payment Questions [from customer] Hi,   I have made a payment for my First Installment of I-140 Attorney Fee which is $4700, but I forgot to include my order ID which is 91782 in the payment process. My card number ends with 4521 and my cardholder name is Dandan Zhang. Could y …","Jan 24, 2025 9:48am - Payment Questions [from customer] Reply to message at Jan 22, 2025 4:21pm   Hello, I have made my initial payment of $4700 but I do not see the client packet available on the portal for review/download. Can you please confirm that my payment has been recieved and when the fol …","Jan 24, 2025 9:27am - Payment Questions [from customer] Reply to message at Jan 23, 2025 10:36am Hi, confirming that I have made the payment for the filing fees using Zelle. I uploaded the receipt as well. ","Jan 24, 2025 12:36am - Retain for I-485/IVP Service [from customer] Reply to message at Jan 23, 2025 8:37pm Thank you for your guidance. Understood the timeline. I would like to kick off the I-485 preparation process from now while retaining you. Please start the process including the I-485/I-765/I-131 Questionnaire …","Jan 24, 2025 7:55am I have uploaded the second part of the payment for your review. Thanks","Jan 24, 2025 10:44am I have paid the recommendation letter fee by e-check","Jan 24, 2025 11:29am - Payment Questions [from customer] Reply to message at Jan 20, 2025 8:40pm Hi, I believe my bank has processed my e-check payment via Stripe for the I-140 filing fee. When I clicked on the link you provided for the invoice, it also indicated that my invoice was paid. Ive uplo …","Jan 24, 2025 6:42am I have now uploaded the receipt to the `Additional Documents` section.","Jan 24, 2025 2:40am I wanted to let you know that Ive just paid my second installment","an 24, 2025 11:47am - Retain for I-485/IVP Service [from customer] Hello,   After some considerations, I think I will just proceed with my green card and take care of my future spouse's in the future. Could you remind me of the fee information for the I-485?   Thanks, Kyuho","Jan 24, 2025 9:19am 'Please find the receipt for the payment in the Documents tab.'","Jan 23, 2025 3:32pm I proceeded with the payment","Jan 23, 2025 9:44pm Payed %1015 through stripe.","Jan 24, 2025 8:28am pay the remaining fee once I receive my diploma (last document I need"],
        ["Personal Notes", "When sending clients I-485 welcome/service&Scope messages, pay attention to client's PD. Need to make sure to follow the formal date format (eg. April 1st, 2023) as well as adjust the chart selected by USCIS in the message. ","Completed Without Issue","1. 'first insallment' -> 'the first installment' 2. Forgot to update the BI and Checklist. When a payment is CONFIRMED, we need to update those two items. 3. Make sure to look at if a NIW client is using accelerated service  or not before deciding whether to send SoC or RBIF related instructions.","Completed Without Issue","Completed Without Issue","Completed Without Issue","1. multiple receipts are uploaded, the singular term is adjusted 2. client made the 2nd $2,000 of $4,700, we will need to specify this new payment, and remind client to upload a receipt for the remaining amount ($700) down the road.","Completed Without Issue","Completed Without Issue","When client has already notified us about the payment in a separate message and is now uploading the receipt as we instructed, we omit the 'thank you for notifyinng us about the payment' and only mention 'uploading the receipt'. Important to customize our message ","Completed Without Issue","revised - posted simplified 485 Service and Scope msg ","Completed Without Issue","Completed Without Issue","Completed Without Issue","1. added 'We will respond to you further as soon as possible' as there are some questions waiting for online pkg team's response 2. client mentioned he will pay the USCIS around March which is more than 1 month from now, so added 'Please kindly keep mind that we must receive the required fees before we can file the case, to avoid any possible delay in the case filing process.'  as a reminder"]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)