import openpyxl
import math
from openpyxl import Workbook
import sys
import json

# ACCEPT JSOM DATA FROM COMMAND-LINE ARGUMENTS
data_json = sys.argv[1]
data = json.loads(data_json)

# LOADING MAIN EXCEL SHEET
wb = openpyxl.load_workbook('./uploadedExcels/arjun-miniproject.xlsx')
sheetname = wb.sheetnames
ws = wb[sheetname[0]]

# IDENTIFYING BRANCHES
branches = set()
for a in ws['B']:
    branches.add(a.value)
# print(branches)
branch_list = list(branches)
print(branch_list)
code_list = list()
sub_list = list()
# CREATING WORKBOOKS FOR EACH BRANCH
for sub in branch_list:
    wb_branch = Workbook()
    ws_branchMain = wb_branch.active
    ws_branchMain.title = 'Main'
    r = 1
    # print(ws.max_row)
    print('\n', sub)
    for p in range(1, ws.max_row+1):
        if (ws.cell(row=p, column=2).value == sub):
            nm = ws.cell(row=p, column=1).value
            regno = nm[-11:-1:1]
            ws_branchMain.cell(row=r, column=1).value = nm
            ws_branchMain.cell(row=r, column=2).value = regno
            ws_branchMain.cell(row=r, column=3).value = ws.cell(
                row=p, column=2).value
            ws_branchMain.cell(row=r, column=4).value = ws.cell(
                row=p, column=4).value
            ws_branchMain.cell(row=r, column=5).value = ws.cell(
                row=p, column=5).value[-9:-3:1]
            r += 1
    codeno = regno[5:7]
    # print(ws_branchMain.max_row,codeno)
    code_list.append(codeno)
    xl = '.\\updatedExcels\\'+codeno+'.xlsx'
    wb_branch.save(xl)
    # sorting in alphabetical order
    wb_branch.create_sheet('Temp')
    wb_branchMain = wb_branch['Temp']
    s = set()
    for r in ws_branchMain.iter_rows(min_row=1, values_only=True):
        s.add(r)
    li = list(s)
    li1 = sorted(li, key=lambda x: x[1])
    for row in li1:
        wb_branchMain.append(row)

    # IDENTIFYING BRANCHES
    slot_set = set()
    for a in wb_branchMain['D']:
        slot_set.add(a.value)
    # print(slot_set)
    slot_list = list(slot_set)
    print(slot_list)
    slot_list.sort()
    thisdict = dict()
    # CREATING SHEETS FOR EACH SLOT IN A BRANCH
    for slot in slot_list:
        wb_branch.create_sheet(slot)
        wb_branchRegular = wb_branch[slot]
        year_set = set()
        print(slot)
        for p in range(1, wb_branchMain.max_row+1):
            if (wb_branchMain.cell(row=p, column=4).value == slot):
                year_set.add(wb_branchMain.cell(row=p, column=2).value[3:5])

        year_list = list(year_set)
        year_list.sort()
        # print('Total years: ',year_set,year_list)
        if len(year_list) != 1:
            wb_branch.create_sheet(slot+'_supply')
            wb_branchSupply = wb_branch[slot+'_supply']
        r = 1
        check_supply = 1
        for p in range(1, wb_branchMain.max_row+1):
            if (wb_branchMain.cell(row=p, column=4).value == slot):
                if (wb_branchMain.cell(row=p, column=2).value[3:5] == year_list[-1]):
                    wb_branchRegular.cell(row=r, column=1).value = wb_branchMain.cell(
                        row=p, column=1).value
                    wb_branchRegular.cell(row=r, column=2).value = wb_branchMain.cell(
                        row=p, column=2).value
                    wb_branchRegular.cell(row=r, column=3).value = wb_branchMain.cell(
                        row=p, column=4).value
                    wb_branchRegular.cell(row=r, column=3).value = wb_branchMain.cell(
                        row=p, column=5).value
                    r += 1
                else:
                    wb_branchSupply.cell(row=check_supply, column=1).value = wb_branchMain.cell(
                        row=p, column=1).value
                    wb_branchSupply.cell(row=check_supply, column=2).value = wb_branchMain.cell(
                        row=p, column=2).value
                    wb_branchSupply.cell(row=check_supply, column=3).value = wb_branchMain.cell(
                        row=p, column=4).value
                    wb_branchSupply.cell(row=check_supply, column=3).value = wb_branchMain.cell(
                        row=p, column=5).value
                    check_supply += 1
        print('Max row in Regular and supply: ', wb_branchRegular.max_row)
        thisdict[codeno+slot] = wb_branchRegular.max_row
        if check_supply > 1:
            print(wb_branchSupply.max_row)
    wb_branch.save(xl)
    sub_list.append(thisdict)

# TAKING DATAS FROM DATA DICTIONARY
rooms = list()
details = list()
date = data['date']
time = data['time']
rooms = data['rooms']
details = data['details']
s = set()
for i in range(len(details)):
    s.add(details[i].get("slot"))
# room_names = list()
slot_list = list(s)
# print(rooms)
# print(details)
# print(slot_list)

for i in slot_list:
    input_slot = i
    # CREATING WORKBOOK FOR GIVEN SLOT AND BRANCHES
    wb_slot = Workbook()
    ws_slotMain = wb_slot.active
    ws_slotMain.title = input_slot
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    wb_slot.create_sheet('balance')
    ws_slot_splyMain = wb_slot['balance']
    p = 1
    b = 1
    code_list = list()
    for i in range(len(details)):
        if details[i].get("slot") == input_slot:
            code_list.append(details[i].get("branch"))
    print(code_list)
    for code in code_list:
        check_supply = 1
        wb_branch = openpyxl.load_workbook('.\\updatedExcels\\'+code+'.xlsx')
        ws_branch_reg = wb_branch[input_slot]
        # CHECKING IF THERE IS SUPPLY STUDENTS OR NOT
        try:
            ws_branch_sply = wb_branch[input_slot+'_supply']
        except:
            check_supply = 0
        check = ws_branch_reg.max_row-(ws_branch_reg.max_row % 15)
        # NO: OF REGULAR STUDENTS THAT CAN BE PLACED IN ROOMS WHICH FITS EXACTLY 15 STUDENTS FROM SINGLE BRANCH i.e slot SHEET
        for r in range(1, check+1):
            # print(ws_branch_reg.max_row-r, ws_branch_reg.max_row, r, p, b, check)
            ws_slotMain.cell(row=p, column=1).value = ws_branch_reg.cell(
                row=r, column=3).value
            ws_slotMain.cell(row=p, column=2).value = ws_branch_reg.cell(
                row=r, column=2).value
            p += 1
        # NO: OF REGULAR STUDENTS WHO WILL NOT FIT IN THE ABOVE CASE SO ADDING THEM WITH SUPPLY STUDENTS  i.e BALANCE SHEET
        for r in range(check+1, ws_branch_reg.max_row+1):
            ws_slot_splyMain.cell(row=b, column=1).value = ws_branch_reg.cell(
                row=r, column=3).value
            ws_slot_splyMain.cell(row=b, column=2).value = ws_branch_reg.cell(
                row=r, column=2).value
            b += 1
        # IF THERE IS SUPPLY STUDENTS ADDING THEM TO BALANCE SHEET
        if (check_supply == 1):
            for r in range(1, ws_branch_sply.max_row+1):
                ws_slot_splyMain.cell(row=b, column=1).value = ws_branch_sply.cell(
                    row=r, column=3).value
                ws_slot_splyMain.cell(row=b, column=2).value = ws_branch_sply.cell(
                    row=r, column=2).value
                b += 1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')

    # normal arrangement
    for i in range(1, math.ceil(ws_slotMain.max_row/30)+1):
        room_sheet = wb_slot.create_sheet('rno'+str(i))
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    sh_nm = wb_slot.sheetnames
    del sh_nm[0]
    del sh_nm[0]
    max_sheets = len(sh_nm)
    j = 0
    p = 1
    ch = 0
    for i in range(1, ws_slotMain.max_row+1, 16):
        room_sheet = wb_slot[sh_nm[j]]
        for r in range(1, 16):
            room_sheet.cell(row=p, column=1).value = ws_slotMain.cell(
                row=(ch*15+r), column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slotMain.cell(
                row=(ch*15+r), column=2).value
            p += 1
        ch += 1
        if (ch >= max_sheets):
            p = 16
        else:
            p = 1
        j = (ch) % max_sheets
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    ch = 0
    # balance students to normal class
    for j in range(max_sheets-1, 1, -1):
        room_sheet = wb_slot[sh_nm[j]]
        if (room_sheet.max_row == 15):
            p = 16
            for r in range(1, 16):
                room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                    row=(ch*15+r), column=1).value
                room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                    row=(ch*15+r), column=2).value
                p += 1
        else:
            break
        ch += 1
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')

    # balance students to drawing room OR NORMAL CLASSROOM
    bal = ws_slot_splyMain.max_row-ch*15
    ch = ch*15
    rem = bal % 30
    extra_rooms = (bal-rem)//30
    for i in range(max_sheets+1, max_sheets+extra_rooms+1):
        room_sheet = wb_slot.create_sheet('rno'+str(i))
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    i1 = ch
    j = -1
    p = 1
    ch = 0
    for i in range(i1+1, ws_slot_splyMain.max_row-rem+1, 15):
        room_sheet = wb_slot[wb_slot.sheetnames[j]]
        for r in range(i, i+15):
            room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                row=r, column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                row=r, column=2).value
            p += 1
        ch += 1
        if (ch >= extra_rooms):
            p = 16
        else:
            p = 1
        j = (ch) % extra_rooms
        j += 1
        j *= -1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    bal = ws_slot_splyMain.max_row-rem
    if rem >= 20:
        room_sheet = wb_slot.create_sheet('new_room')
        room_sheet = wb_slot['new_room']
        p = 1
        for r in range(bal+1, ws_slot_splyMain.max_row+1):
            room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                row=r, column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                row=r, column=2).value
            p += 1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    elif rem <= 10:
        room_sheet = wb_slot[wb_slot.sheetnames[-1]]
        p = 31
        for r in range(bal+1, ws_slot_splyMain.max_row+1):
            room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                row=r, column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                row=r, column=2).value
            p += 1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    else:
        rem_part1 = rem//2
        p = 31
        room_sheet = wb_slot[wb_slot.sheetnames[-1]]
        for r in range(bal+1, ws_slot_splyMain.max_row-rem_part1+1):
            room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                row=r, column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                row=r, column=2).value
            p += 1
        p = 31
        room_sheet = wb_slot[wb_slot.sheetnames[-2]]
        bal = r
        for r in range(bal+1, ws_slot_splyMain.max_row+1):
            room_sheet.cell(row=p, column=1).value = ws_slot_splyMain.cell(
                row=r, column=1).value
            room_sheet.cell(row=p, column=2).value = ws_slot_splyMain.cell(
                row=r, column=2).value
            p += 1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')

    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
    # print(wb_slot.sheetnames)

    # RENAMING ROOMS
    sh_nm = wb_slot.sheetnames
    del sh_nm[0]
    del sh_nm[0]
    for j in sh_nm:
        room_sheet = wb_slot[j]
        room_sheet.insert_cols(idx=1)
        max_alloc1 = room_sheet.max_row//2
        max_alloc2 = room_sheet.max_row-max_alloc1
        wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
        li = list()
        for i in range(1, max_alloc1+1):
            li.append('A'+str(i))
        for i in range(1, max_alloc2+1):
            li.append('B'+str(i))
        r = 1
        for i in li:
            room_sheet.cell(row=r, column=1).value = i
            r += 1
        for i in range(len(rooms)):
            if ((room_sheet.max_row <= rooms[i].get("capacity"))):
                room_sheet.title = rooms[i].get("room_no")
                # print(rooms[i].get("room_no"))
                del rooms[i]
                wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
                break
    wb_slot.save('.\\updatedExcels\\'+date+'_'+time+'.xlsx')
